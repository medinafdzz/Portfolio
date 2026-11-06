import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Screen } from './geometry';
import { createDisplay } from './textures';
import ModelPart from './models';

function SpaceEnvironment() {
  const moon = useTexture('/textures/moon.jpg');
  // Three.js texture resources are mutable and shared outside React state.
  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { moon.colorSpace = THREE.SRGBColorSpace; }, [moon]);
  const stars = useMemo(() => {
    const data = new Float32Array(1800);
    for(let i=0;i<600;i++){data[i*3]=(Math.sin(i*127.1)*.5+.5)*75-37.5;data[i*3+1]=(Math.sin(i*311.7)*.5+.5)*35-10;data[i*3+2]=-30-(i%11);}
    return data;
  }, []);
  return <group>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars,3]}/></bufferGeometry><pointsMaterial size={.045} sizeAttenuation color="#a7c9e8" transparent opacity={.8}/></points>
    <group name="miniature-earth" position={[.8,3.1,-18]} rotation={[0,.2,.08]} scale={4.6}>
      <ModelPart part="EarthOcean"/><ModelPart part="EarthLand"/><ModelPart part="EarthClouds"/>
    </group>
    <mesh position={[7,5.6,-17]}><sphereGeometry args={[.55,32,24]}/><meshStandardMaterial map={moon} roughness={1}/></mesh>
  </group>;
}

function Cabin() {
  const radar=useMemo(()=>createDisplay('radar'),[]);
  useEffect(()=>()=>radar.dispose(),[radar]);
  return <group>
    <SpaceEnvironment/>
    <ModelPart part="CabinShell" name="cabin-baked"/>
    <group name="command-console">
      <ModelPart part="ConsoleBody" name="console-integrated-body"/>
      <group position={[0,2.865,-1.94]} rotation={[-.872,0,0]}>
        <Screen name="orbital-radar" texture={radar} size={[2.73,1.025]} position={[0,0,.027]}/>
      </group>
    </group>
    <ModelPart part="Chair"/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,1.7]} receiveShadow>
      <circleGeometry args={[2.65,64]}/><shadowMaterial transparent opacity={.24}/>
    </mesh>
  </group>;
}

export default memo(Cabin);
