// Discovers every API, pulls its OpenAPI spec, bundles it and writes generated/registry.json.
//
// Sources (all optional, merged by id):
//   1. projects/projects.json   curated projects (spec: projects/<id>/openapi.yaml, or "spec": {url|path})
//   2. apis/*.{yaml,yml,json}   drop-in specs – auto-documented, no other files needed
//   3. apis/sources.json        live services: [{ "id", "url", "headers"? }] – fetched at build time
//
// Metadata comes from the registry entry, else from the spec's info block / x-meridian extension.
import {bundle, createConfig, stringifyYaml} from '@redocly/openapi-core';
import {existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const GEN = 'generated';
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const readJson = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : []);
const env = (s) => s.replace(/\$\{(\w+)\}/g, (_, k) => {
  if (!(k in process.env)) throw new Error(`env var ${k} not set`);
  return process.env[k];
});
// Mirrors docusaurus-plugin-openapi-docs doc ids (kebab-cased operationId).
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

rmSync(GEN, {recursive: true, force: true});
mkdirSync(`${GEN}/specs`, {recursive: true});
mkdirSync('static/openapi', {recursive: true});

// ---- 1. collect sources -------------------------------------------------------------------
const sources = new Map();
const add = (id, entry) => {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`invalid API id "${id}" (use lowercase-kebab)`);
  sources.set(id, {...sources.get(id), ...entry, id});
};

for (const p of readJson('projects/projects.json')) {
  add(p.id, {...p, origin: 'curated', spec: p.spec ?? {path: `projects/${p.id}/openapi.yaml`}});
}
if (existsSync('apis')) {
  for (const f of readdirSync('apis')) {
    const m = f.match(/^(.+)\.(ya?ml|json)$/);
    if (m && f !== 'sources.json' && !f.endsWith('.example.json')) {
      add(m[1], {origin: 'discovered', spec: {path: `apis/${f}`}, ...(sources.get(m[1]) ?? {})});
    }
  }
}
for (const s of readJson('apis/sources.json')) {
  add(s.id, {origin: 'remote', ...sources.get(s.id), spec: {url: s.url, headers: s.headers}, optional: s.optional});
}

// ---- 2. fetch, bundle, derive metadata ----------------------------------------------------
const config = await createConfig({});
const registry = [];

for (const src of sources.values()) {
  let specPath = src.spec.path;
  if (src.spec.url) {
    try {
      const headers = Object.fromEntries(Object.entries(src.spec.headers ?? {}).map(([k, v]) => [k, env(v)]));
      const res = await fetch(env(src.spec.url), {headers});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      specPath = `${GEN}/specs/${src.id}.${body.trimStart().startsWith('{') ? 'json' : 'yaml'}`;
      writeFileSync(specPath, body);
    } catch (e) {
      const msg = `${src.id}: cannot fetch ${src.spec.url} (${e.message})`;
      if (src.optional) { console.warn(`⚠ skipped ${msg}`); continue; }
      throw new Error(msg);
    }
  }
  if (!existsSync(specPath)) throw new Error(`${src.id}: spec not found at ${specPath}`);

  const {bundle: result, problems} = await bundle({ref: specPath, config});
  const errors = problems.filter((p) => p.severity === 'error');
  if (errors.length) throw new Error(`${src.id}: ${errors.map((e) => e.message).join('; ')}`);
  const spec = result.parsed;
  if (!spec.openapi && !spec.swagger) throw new Error(`${src.id}: not an OpenAPI document`);
  writeFileSync(`static/openapi/${src.id}.yaml`, stringifyYaml(spec));

  const info = spec.info ?? {};
  const x = info['x-meridian'] ?? {};
  const operations = [];
  for (const [route, item] of Object.entries(spec.paths ?? {})) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      if (!op.operationId) console.warn(`⚠ ${src.id}: ${method.toUpperCase()} ${route} has no operationId`);
      const docId = kebab(op.operationId ?? op.summary ?? `${method}-${route}`);
      operations.push({
        project: src.id, operationId: op.operationId ?? docId, docId,
        method: method.toUpperCase(), path: route, summary: op.summary ?? `${method.toUpperCase()} ${route}`,
        tags: op.tags ?? [], url: `/${src.id}/api/${docId}`,
      });
    }
  }

  const curatedDocs = `projects/${src.id}/docs`;
  const hasGuides = existsSync(curatedDocs);
  const docsPath = hasGuides ? curatedDocs : `${GEN}/docs/${src.id}`;
  const project = {
    id: src.id,
    name: src.name ?? x.name ?? info.title?.replace(/\s+API$/i, '') ?? src.id,
    domain: src.domain ?? x.domain ?? 'Uncategorised',
    owner: src.owner ?? x.owner ?? info.contact?.name ?? 'Unassigned',
    status: src.status ?? x.status ?? 'GA',
    version: src.version ?? info.version ?? '0.0.0',
    summary: src.summary ?? x.summary ?? (info.description ?? '').split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim(),
    dependsOn: src.dependsOn ?? x.dependsOn ?? [],
    origin: src.origin,
    source: src.spec.url ?? src.spec.path,
    title: info.title ?? src.id,
    servers: spec.servers ?? [],
    operations,
    schemas: Object.keys(spec.components?.schemas ?? {}),
    docsPath,
    hasGuides,
    specFile: `static/openapi/${src.id}.yaml`,
  };
  registry.push(project);

  if (!hasGuides) {
    mkdirSync(docsPath, {recursive: true});
    writeFileSync(`${docsPath}/intro.mdx`, autoIntro(project, info));
  }
  mkdirSync(`${GEN}/sidebars`, {recursive: true});
  writeFileSync(
    `${GEN}/sidebars/${src.id}.ts`,
    `import {projectSidebar} from '../../src/sidebars/projectSidebar';\n` +
      `export default {main: projectSidebar(${JSON.stringify(path.resolve(docsPath))})};\n`,
  );
  console.log(`✔ ${src.id.padEnd(14)} ${src.origin.padEnd(10)} ${operations.length} ops  ← ${project.source}`);
}

// Dependencies must point at known APIs.
const ids = new Set(registry.map((p) => p.id));
for (const p of registry) {
  const unknown = p.dependsOn.filter((d) => !ids.has(d));
  if (unknown.length) throw new Error(`${p.id}: dependsOn unknown API(s) ${unknown.join(', ')}`);
}
writeFileSync(`${GEN}/registry.json`, JSON.stringify(registry, null, 2));
console.log(`\n${registry.length} APIs, ${registry.reduce((n, p) => n + p.operations.length, 0)} operations → ${GEN}/registry.json`);

function autoIntro(p, info) {
  const esc = (s) => String(s).replace(/[{}<>]/g, (c) => `&#${c.charCodeAt(0)};`);
  return `---
title: Overview
sidebar_position: 1
---

# ${esc(p.name)}

:::note Auto-documented
Generated from the OpenAPI spec at \`${esc(p.source)}\`. Add \`projects/${p.id}/docs/\` to replace this page with hand-written guides.
:::

**Domain:** ${esc(p.domain)} · **Owner:** ${esc(p.owner)} · **Status:** ${esc(p.status)} · **Version:** v${esc(p.version)}

${esc(info.description ?? '')}

| | |
|---|---|
| **Servers** | ${p.servers.map((s) => `\`${esc(s.url)}\``).join('<br/>') || '—'} |
| **Spec** | [Download OpenAPI (bundled)](pathname:///openapi/${p.id}.yaml) |
| **Reference** | [API Reference](/${p.id}/api) |

## Operations

<OperationTable project="${p.id}" />
`;
}
