import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { objectPositions } from '../src/space/config.js';

test('generated scene includes baked unlit shell, articulated parts and embedded UV textures', () => {
  const data=readFileSync(new URL('../public/models/spacefolio.glb',import.meta.url));
  assert.equal(data.toString('ascii',0,4),'glTF');
  const model=JSON.parse(data.toString('utf8',20,20+data.readUInt32LE(12)));
  assert.ok(model.extensionsRequired.includes('KHR_draco_mesh_compression'),'Geometry compression missing');
  assert.ok(data.length<6*1024*1024,'GLB exceeds 6 MiB download budget');
  const names=new Set(model.nodes.map(n=>n.name));
  for(const name of ['CabinShell','ConsoleBody','Chair','RoadmapFrame','RocketBody','Lectern','BookBase','BookCover','MedalFrame','MedalFace','TechBase','TechGear','PhoneBase','PhoneReceiver','RobotTorso','RobotHead','RobotUpperArmL','RobotLowerArmL','RobotThighL','RobotShinL']) assert.ok(names.has(name),`Missing ${name}`);
  assert.ok(model.materials.some(m=>m.extensions?.KHR_materials_unlit && m.pbrMetallicRoughness?.baseColorTexture),'No unlit atlas material');
  assert.ok(model.images.every(image=>Number.isInteger(image.bufferView)),'Textures must be embedded');
  assert.ok(model.meshes.every(mesh=>mesh.primitives.every(p=>p.attributes.TEXCOORD_0!==undefined)),'Missing UVs');
  assert.ok(!model.cameras?.length && !model.extensions?.KHR_lights_punctual,'Unexpected exported cameras or lamps');
  const manifest=JSON.parse(readFileSync(new URL('../assets/spacefolio/manifest.json',import.meta.url)));
  assert.deepEqual(manifest.source_config.objectPositions,objectPositions,'Scene generated from stale placements');
});
