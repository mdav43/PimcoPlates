import {existsSync, readFileSync, rmSync} from 'node:fs';

if (existsSync('generated/registry.json')) {
  for (const {docsPath} of JSON.parse(readFileSync('generated/registry.json', 'utf8'))) {
    rmSync(`${docsPath}/api`, {recursive: true, force: true});
  }
}
rmSync('generated', {recursive: true, force: true});
rmSync('static/openapi', {recursive: true, force: true});
