import {usePluginData} from '@docusaurus/useGlobalData';
import type {CatalogProject} from '../../plugins/api-catalog';

export function useCatalog(): CatalogProject[] {
  return (usePluginData('api-catalog') as {projects: CatalogProject[]}).projects;
}

export function useProject(id: string): CatalogProject {
  const p = useCatalog().find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project "${id}" – check projects/projects.json`);
  return p;
}
