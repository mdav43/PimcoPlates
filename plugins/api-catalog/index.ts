import fs from 'node:fs';
import path from 'node:path';
import {bundle, createConfig} from '@redocly/openapi-core';
import type {LoadContext, Plugin} from '@docusaurus/types';

export type CatalogOperation = {
  project: string;
  operationId: string;
  docId: string;
  method: string;
  path: string;
  summary: string;
  tags: string[];
  url: string;
};

export type CatalogProject = {
  id: string;
  name: string;
  domain: string;
  owner: string;
  status: string;
  version: string;
  summary: string;
  dependsOn: string[];
  title: string;
  servers: {url: string; description?: string}[];
  operations: CatalogOperation[];
  schemas: string[];
};

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
// Mirrors docusaurus-plugin-openapi-docs doc id generation (kebab-cased operationId).
const kebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

/** Reads every project's OpenAPI spec and exposes a cross-project catalog as global data. */
export default function apiCatalog(context: LoadContext): Plugin<CatalogProject[]> {
  const root = context.siteDir;
  const registry = path.join(root, 'projects/projects.json');
  return {
    name: 'api-catalog',
    getPathsToWatch: () => [registry, path.join(root, 'projects/*/openapi.yaml')],
    async loadContent() {
      const projects = JSON.parse(fs.readFileSync(registry, 'utf8'));
      const config = await createConfig({});
      return Promise.all(projects.map(async (p: any): Promise<CatalogProject> => {
        // Bundle so shared $refs (Money, AccountRef, …) count as this project's schemas.
        const {bundle: result} = await bundle({ref: path.join(root, `projects/${p.id}/openapi.yaml`), config});
        const spec: any = result.parsed;
        const operations: CatalogOperation[] = [];
        for (const [route, item] of Object.entries<any>(spec.paths ?? {})) {
          for (const method of METHODS) {
            const op = item[method];
            if (!op?.operationId) continue;
            const docId = kebab(op.operationId);
            operations.push({
              project: p.id,
              operationId: op.operationId,
              docId,
              method: method.toUpperCase(),
              path: route,
              summary: op.summary ?? '',
              tags: op.tags ?? [],
              url: `/${p.id}/api/${docId}`,
            });
          }
        }
        return {
          ...p,
          title: spec.info.title,
          servers: spec.servers ?? [],
          operations,
          schemas: Object.keys(spec.components?.schemas ?? {}),
        };
      }));
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData({projects: content});
    },
  };
}
