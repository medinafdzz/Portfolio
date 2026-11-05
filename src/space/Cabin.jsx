import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Screen } from './geometry';
import { createDisplay } from './textures';
import ModelPart from './models';

function SpaceEnvironment() {
  const [earth, night, moon] = useTexture(['/textures/earth-day.jpg', '/textures/earth-night.jpg', '/textures/moon.jpg']);
  useEffect(() => { for (const texture of [earth, night, moon]) texture.colorSpace = THREE.SRGBColorSpace; }, [earth,night,moon]);
  const stars = useMemo(() => {
    const data = new Float32Array(1800);
    for(let i=0;i<600;i++){data[i*3]=(Math.sin(i*127.1)*.5+.5)*75-37.5;data[i*3+1]=(Math.sin(i*311.7)*.5+.5)*35-10;data[i*3+2]=-30-(i%11);}
    return data;
  }, []);
  return <group>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[stars,3]}/></bufferGeometry><pointsMaterial size={.045} sizeAttenuation color="#a7c9e8" transparent opacity={.8}/></points>
    <group position={[1.2,-8,-20]} rotation={[.4,-1.85,.15]}>
      <mesh><sphereGeometry args={[13,96,64]}/><meshStandardMaterial map={earth} metalness={.05} roughness={.9} emissive="#ffd3a0" emissiveMap={night} emissiveIntensity={1.8}/></mesh>
      <mesh scale={1.008}><sphereGeometry args={[13,80,48]}/><shaderMaterial transparent depthWrite={false} uniforms={{color:{value:new THREE.Color('#56a9f8')}}} vertexShader="varying vec3 vNormal; varying vec3 vView; void main(){ vec4 p = modelViewMatrix * vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p;}" fragmentShader="varying vec3 vNormal; varying vec3 vView; uniform vec3 color; void main(){float rim=pow(1.0-max(0.0,dot(vNormal,vView)),4.0); gl_FragColor=vec4(color,rim*.85);}"/></mesh>
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
