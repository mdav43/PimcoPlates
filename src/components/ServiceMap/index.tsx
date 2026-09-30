import React from 'react';
import Mermaid from '@theme/Mermaid';
import {useCatalog} from '@site/src/hooks/useCatalog';

/** Dependency graph of every API, generated from the registry (`dependsOn`). */
export default function ServiceMap() {
  const projects = useCatalog();
  const label = (s: string) => s.replace(/"/g, "'");
  const lines = ['flowchart LR'];
  for (const p of projects) {
    lines.push(`  ${p.id}["${label(p.name)}"]`);
    lines.push(`  click ${p.id} "/${p.id}/intro"`);
    if (p.origin !== 'curated') lines.push(`  class ${p.id} auto`);
  }
  for (const p of projects) for (const d of p.dependsOn) lines.push(`  ${p.id} --> ${d}`);
  lines.push('  classDef auto stroke-dasharray: 5 3');
  return <Mermaid value={lines.join('\n')} />;
}
