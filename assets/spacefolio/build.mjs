import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { colors, objectPositions } from '../../src/space/config.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const config=fileURLToPath(new URL('../../artifacts/spacefolio-config.json',import.meta.url));
mkdirSync(new URL('../../artifacts/',import.meta.url),{recursive:true});
writeFileSync(config,JSON.stringify({colors,objectPositions}));
const run=spawnSync(process.argv[2]||process.env.BLENDER_BIN||'blender',[
  '--background','--factory-startup','-t','4','--python-exit-code','1',
  '--python',fileURLToPath(new URL('build.py',import.meta.url)),
  '--','--config',config,...process.argv.slice(3),
],{cwd:root,stdio:'inherit'});
if(run.error)console.error(run.error.message);
process.exit(run.status??1);
