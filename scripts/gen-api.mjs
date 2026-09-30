// Generates API reference MDX for every API in generated/registry.json
// (one docusaurus-plugin-openapi-docs instance per API).
import {execFileSync} from 'node:child_process';
import {readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';

const registry = JSON.parse(readFileSync('generated/registry.json', 'utf8'));
for (const {id, docsPath} of registry) {
  rmSync(`${docsPath}/api`, {recursive: true, force: true}); // no stale pages for removed operations
  execFileSync('npx', ['docusaurus', 'gen-api-docs', 'all', '--plugin-id', `openapi-${id}`], {stdio: ['ignore', 'ignore', 'inherit']});
  // Give each API's info page a stable URL: /<id>/api
  const dir = `${docsPath}/api`;
  const file = `${dir}/${readdirSync(dir).find((f) => f.endsWith('.info.mdx'))}`;
  writeFileSync(file, readFileSync(file, 'utf8').replace(/^---\n/, '---\nslug: /api\n'));
  console.log(`generated API reference for ${id}`);
}
