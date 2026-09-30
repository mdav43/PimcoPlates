// Bundles each project's OpenAPI spec (resolving shared $refs) into static/openapi/<id>.yaml
// so consumers can download a single self-contained file from the portal.
import {bundle, createConfig, stringifyYaml} from '@redocly/openapi-core';
import {mkdir, readFile, writeFile} from 'node:fs/promises';

const projects = JSON.parse(await readFile(new URL('../projects/projects.json', import.meta.url)));
const config = await createConfig({});
await mkdir('static/openapi', {recursive: true});

for (const {id} of projects) {
  const {bundle: result, problems} = await bundle({ref: `projects/${id}/openapi.yaml`, config});
  const errors = problems.filter((p) => p.severity === 'error');
  if (errors.length) throw new Error(`${id}: ${errors.map((e) => e.message).join('; ')}`);
  await writeFile(`static/openapi/${id}.yaml`, stringifyYaml(result.parsed));
  console.log(`bundled ${id} -> static/openapi/${id}.yaml`);
}
