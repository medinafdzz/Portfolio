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
  for(const name of ['RoadmapSupport','MedalNumber','EarthOcean','EarthLand','EarthClouds','ShipHull','LaptopBase','LaptopLid']) assert.ok(names.has(name),`Missing refinement ${name}`);
  for(const name of ['CabinShell','ConsoleBody','Chair','RoadmapFrame','RocketBody','Lectern','BookBase','BookCover','MedalFrame','MedalFace','PhoneBase','PhoneReceiver','RobotTorso','RobotHead','RobotUpperArmL','RobotLowerArmL','RobotThighL','RobotShinL']) assert.ok(names.has(name),`Missing ${name}`);
  assert.ok(model.materials.some(m=>m.extensions?.KHR_materials_unlit && m.pbrMetallicRoughness?.baseColorTexture),'No unlit atlas material');
  assert.ok(model.images.every(image=>Number.isInteger(image.bufferView)),'Textures must be embedded');
  assert.ok(model.meshes.every(mesh=>mesh.primitives.every(p=>!model.materials[p.material].pbrMetallicRoughness?.baseColorTexture||p.attributes.TEXCOORD_0!==undefined)),'Textured surfaces require UVs');
  assert.ok(model.meshes.every(mesh=>mesh.primitives.every(p=>p.attributes.NORMAL===undefined)),'Unlit materials do not need normal buffers');
  assert.ok(!model.cameras?.length && !model.extensions?.KHR_lights_punctual,'Unexpected exported cameras or lamps');
  const manifest=JSON.parse(readFileSync(new URL('../assets/spacefolio/manifest.json',import.meta.url)));
  assert.deepEqual(manifest.source_config.objectPositions,objectPositions,'Scene generated from stale placements');
  assert.equal(objectPositions[0][1],3.8,'Experience must be raised to the window midpoint');
  assert.ok(manifest.parts.PhoneBase.triangles<18000,'Phone cord is excessively tessellated');
  assert.ok(manifest.parts.MedalFace.triangles<10000,'Medal relief is excessively tessellated');
  assert.equal(manifest.geometry_font,'Satoshi-Bold.otf');
  const phone=model.meshes.find(mesh=>mesh.name==='PhoneBase');
  const phoneBounds=model.accessors[phone.primitives[0].attributes.POSITION];
  assert.ok(phoneBounds.min[1]>-.9,'The removed cord must not remain below the phone');
  assert.ok(model.materials.every(m=>m.extensions?.KHR_materials_unlit),'Runtime lighting was not baked');
  assert.ok(model.meshes.every(mesh=>mesh.primitives.length===1),'Each rigid part must use one draw call');
});

test('CPU-only asset keeps the same parts and a small triangle budget',()=>{
  const bytes=readFileSync(new URL('../public/models/spacefolio-lite.glb',import.meta.url));
  const model=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  const manifest=JSON.parse(readFileSync(new URL('../assets/spacefolio/manifest.json',import.meta.url)));
  assert.ok(manifest.cpu_detail.triangles<40000);
  assert.ok(bytes.length<1024*1024);
  for(const name of Object.keys(manifest.parts)) assert.ok(model.nodes.some(n=>n.name===name),`Missing low-detail ${name}`);
  assert.ok(model.meshes.every(mesh=>mesh.primitives.length===1));
});
