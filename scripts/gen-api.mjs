// Generates API reference MDX for every project in the registry
// (one docusaurus-plugin-openapi-docs instance per project).
import {execFileSync} from 'node:child_process';
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';

const projects = JSON.parse(readFileSync(new URL('../projects/projects.json', import.meta.url)));
for (const {id} of projects) {
  execFileSync('npx', ['docusaurus', 'gen-api-docs', 'all', '--plugin-id', `openapi-${id}`], {stdio: ['ignore', 'ignore', 'inherit']});
  // Give each API's info page a stable URL: /<id>/api
  const dir = `projects/${id}/docs/api`;
  const info = readdirSync(dir).find((f) => f.endsWith('.info.mdx'));
  const file = `${dir}/${info}`;
  writeFileSync(file, readFileSync(file, 'utf8').replace(/^---\n/, '---\nslug: /api\n'));
  console.log(`generated API docs for ${id}`);
}
