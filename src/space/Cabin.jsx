import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { Block, Cylinder, Orb, Ring, Screen, Tube } from './geometry';
import { colors } from './config';
import { createDisplay } from './textures';

const windowPath = [[-4.9,1.9,-3.8],[-5.05,2.6,-3.8],[-4.7,4.7,-3.8],[-3.9,5.6,-3.8],[0,5.9,-3.8],[3.9,5.6,-3.8],[4.7,4.7,-3.8],[5.05,2.6,-3.8],[4.9,1.9,-3.8],[0,1.82,-3.8],[-4.9,1.9,-3.8]];
const deskEdge = [[-5.65,1.95,.65],[-4.3,1.95,.35],[-3.1,1.95,-.3],[0,1.95,-.65],[3.1,1.95,-.3],[4.3,1.95,.35],[5.65,1.95,.65]];

function Desk() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-5.65,-.65); shape.quadraticCurveTo(-4.4,-.5,-3.1,.3); shape.quadraticCurveTo(0,.95,3.1,.3); shape.quadraticCurveTo(4.4,-.5,5.65,-.65);
    shape.lineTo(5.75,2.9); shape.quadraticCurveTo(0,3.4,-5.75,2.9); shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: .18, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .045, curveSegments: 32 });
  }, []);
  const screen = useMemo(() => createDisplay('console'), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => screen.dispose(), [screen]);
  return <group>
    <mesh geometry={geometry} rotation={[-Math.PI/2,0,0]} position={[0,1.91,0]} castShadow receiveShadow><meshStandardMaterial color="#9c9fa1" metalness={.36} roughness={.36}/></mesh>
    <Tube points={deskEdge.map(([x,y,z]) => [x,y+.045,z+.025])} radius={.025} color="#ff8c32" glow={1.8}/>
    {[-4.8,-3,3,4.8].map(x => <group key={x} position={[x,1,.3]}><Block size={[1.3,1.55,1.25]} color={colors.dark} radius={.1}/><Block size={[1.05,.65,.06]} position={[0,.25,.66]} color="#41464e"/><Block size={[.67,.045,.05]} position={[0,.52,.71]} color={colors.amber} glow={2}/><Block size={[1.05,.45,.06]} position={[0,-.38,.66]} color="#41464e"/><Block size={[.4,.035,.06]} position={[0,-.19,.71]} color={colors.steel}/></group>)}
    <group position={[0,2.27,-1.96]} rotation={[-.12,0,0]}><Block size={[2.8,.62,.16]} color={colors.dark}/><Screen texture={screen} size={[2.6,.47]} position={[0,0,.09]}/></group>
    {[-1,1].map(side => <group key={side} position={[side * 2,2.08,-2.65]}>{Array.from({length:7},(_,i) => <Block key={i} size={[.1,.035,.05]} position={[i*.18,0,0]} color={i%3 ? colors.amber : colors.steel} glow={1.3}/>)}</group>)}
  </group>;
}

export function PilotChair() {
  return <group position={[0,0,.95]}>
    <Cylinder radius={.62} height={.12} color={colors.dark} position={[0,.12,0]}/><Cylinder radius={.12} height={.65} color={colors.steel} position={[0,.48,0]}/>
    <Block size={[1.35,.28,1.2]} color="#353a43" position={[0,.88,0]} radius={.14}/>
    <group position={[0,1.35,.5]} rotation={[-.12,0,0]}><Block size={[1.38,1.38,.34]} color="#2d333b" radius={.17}/><Block size={[1.12,1.1,.12]} position={[0,.04,.18]} color="#484b51" radius={.15}/><Block size={[.43,.045,.03]} position={[0,.2,.26]} color={colors.amber} glow={2.5}/><Block size={[.7,.35,.1]} position={[0,-.3,.23]} color="#30363e"/></group>
    {[-1,1].map(side => <group key={side} position={[side*.77,1.15,0]}><Cylinder radius={.055} height={.6} position={[0,-.15,.1]} color={colors.steel}/><Block size={[.23,.17,.95]} color="#686c72" radius={.08}/></group>)}
  </group>;
}

function Plant({ position, scale = 1 }) {
  return <group position={position} scale={scale}><Cylinder radius={.4} top={.48} height={.65} color="#494940" position={[0,.33,0]}/><Cylinder radius={.44} height={.03} color="#242a24" position={[0,.66,0]}/>{Array.from({length:13},(_,i) => { const angle=i*2.4; const height=.8+i*.085; return <group key={i}><Tube points={[[0,.6,0],[Math.sin(angle)*.3,height,Math.cos(angle)*.3],[Math.sin(angle)*.55,height+.18,Math.cos(angle)*.55]]} radius={.02} color="#425b32"/><Orb size={[.17,.38,.055]} position={[Math.sin(angle)*.52,height+.2,Math.cos(angle)*.52]} rotation={[.3,angle,-Math.sin(angle)*.7]} color={i%3 ? '#4b633b' : '#708249'}/></group>; })}</group>;
}

function SpaceEnvironment({ reducedMotion }) {
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
    {!reducedMotion && <pointLight position={[5,9,-12]} color="#9bcfff" intensity={35} distance={35}/>}
  </group>;
}

function Cabin({ reducedMotion }) {
  const wall = useMemo(() => {
    const outer = new THREE.Shape(); outer.moveTo(-25,-1); outer.lineTo(25,-1); outer.lineTo(25,20); outer.lineTo(-25,20); outer.closePath();
    const hole = new THREE.Path(); hole.moveTo(-4.9,1.9); hole.lineTo(4.9,1.9); hole.quadraticCurveTo(5.25,2.4,4.75,4.65); hole.quadraticCurveTo(4.5,5.7,3.8,5.65); hole.quadraticCurveTo(0,6.1,-3.8,5.65); hole.quadraticCurveTo(-4.5,5.7,-4.75,4.65); hole.quadraticCurveTo(-5.25,2.4,-4.9,1.9);
    outer.holes.push(hole);
    return new THREE.ExtrudeGeometry(outer,{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:3,curveSegments:32});
  },[]);
  useEffect(() => () => wall.dispose(), [wall]);
  return <group>
    <SpaceEnvironment reducedMotion={reducedMotion}/>
    <mesh geometry={wall} position={[0,0,-4.03]} receiveShadow><meshStandardMaterial color="#41464f" metalness={.2} roughness={.78}/></mesh>
    <Block size={[14,.28,10]} position={[0,-.22,0]} color="#3b3b3d" radius={.03}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.065,1.7]} receiveShadow><circleGeometry args={[2.7,80]}/><meshStandardMaterial color="#615d58" roughness={1}/></mesh>
    <Ring radius={2.55} tube={.014} rotation={[-Math.PI/2,0,0]} position={[0,-.045,1.7]} color="#898078"/>
    <Tube points={windowPath} radius={.24} color="#74767a"/>
    <Tube points={windowPath.map(([x,y,z])=>[x,y,z+.06])} radius={.1} color="#2d323b"/>
    <Tube points={windowPath.map(([x,y,z])=>[x*1.035,y*1.015,z-.06])} radius={.045} color="#c49c69" glow={.35}/>
    <Block size={[11,1.8,.8]} position={[0,.77,-3.7]} color={colors.dark}/>
    <Block size={[13,1,.8]} position={[0,6.45,-3.8]} color={colors.dark}/>
    {[-1,1].map(side => <group key={side}>
      <Block size={[1.6,5.5,1.05]} position={[side*5.75,3,-2.55]} rotation={[0,-side*.3,0]} radius={.28} color="#494e56"/>
      <Block size={[.5,6,4]} position={[side*6.45,3,-.7]} color={colors.dark} radius={.16}/>
      <Block size={[1.6,.22,3.5]} position={[side*5.2,5.95,-1.3]} rotation={[0,0,side*.34]} color="#71757c"/>
      <Block size={[.9,.035,.06]} position={[side*5.45,4.85,-1.94]} color={colors.amber} glow={2.4}/>
      <Block size={[.95,.14,.3]} position={[side*5.45,4.96,-2.02]} color={colors.dark}/>
      {Array.from({length:5},(_,i)=><Block key={i} size={[.6,.028,.1]} position={[side*6.11,1.8+i*.52,-1.84]} color="#272e36"/>)}
      <Tube points={[[side*5.84,.3,-1.2],[side*5.84,2,-1.2],[side*5.5,4.8,-1.7],[side*4.8,6,-2]]} radius={.035} color="#82858b"/>
    </group>)}
    <Cylinder radius={1.28} height={.12} position={[0,6.25,-.8]} color={colors.dark}/><Cylinder radius={1.1} height={.06} position={[0,6.15,-.8]} color={colors.amber} glow={1.5}/>
    <Desk/><PilotChair/>
    <Plant position={[-5.7,0,2.7]} scale={1.3}/><Plant position={[5.8,0,2.8]} scale={1.1}/>
  </group>;
}

export default memo(Cabin);
