import {rmSync, readFileSync} from 'node:fs';

const projects = JSON.parse(readFileSync(new URL('../projects/projects.json', import.meta.url)));
for (const {id} of projects) rmSync(`projects/${id}/docs/api`, {recursive: true, force: true});
rmSync('static/openapi', {recursive: true, force: true});
