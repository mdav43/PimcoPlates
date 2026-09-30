import fs from 'node:fs';
import path from 'node:path';
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
  origin: 'curated' | 'discovered' | 'remote';
  source: string;
  title: string;
  servers: {url: string; description?: string}[];
  operations: CatalogOperation[];
  schemas: string[];
  docsPath: string;
  hasGuides: boolean;
};

/** Exposes the API registry built by scripts/sync-apis.mjs as global data for pages/components. */
export default function apiCatalog(context: LoadContext): Plugin<CatalogProject[]> {
  const file = path.join(context.siteDir, 'generated/registry.json');
  return {
    name: 'api-catalog',
    getPathsToWatch: () => [file],
    async loadContent() {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    },
    async contentLoaded({content, actions}) {
      actions.setGlobalData({projects: content});
    },
  };
}
