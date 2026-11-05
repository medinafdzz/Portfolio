import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Cabin from './Cabin';
import Robot from './Robot';
import Objects from './Objects';
import { objectPositions } from './config';
import { sectionIds } from './navigation';

function CameraController({ phase, section, reducedMotion }) {
  const { camera, size, invalidate } = useThree();
  const regress = useThree(state => state.performance.regress);
  const aim = useRef({ x: 0, y: 2.45, z: -1.3 });
  const intro = phase === 'INTRO';
  // Three.js camera objects are mutable scene resources, outside React's state model.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const portrait = size.width / size.height < 1;
    const index = sectionIds.indexOf(section);
    const focusing = index >= 0 && phase !== 'CLOSING_SECTION';
    const objectX = focusing ? objectPositions[index][0] : 0;
    const position = portrait ? [objectX*.32, 4.5, 12] : [objectX*.09, intro ? 3.8 : 4.25, intro ? 10.4 : 10.6];
    const target = { x: portrait ? objectX*.45 : objectX*.15, y: portrait ? 2.3 : 2.45, z: -1.3 };
    camera.fov = portrait ? 47 : 40;
    camera.updateProjectionMatrix();
    const update = () => { camera.lookAt(aim.current.x, aim.current.y, aim.current.z); if (!reducedMotion) regress(); invalidate(); };
    const duration = reducedMotion ? 0 : phase === 'ENTERING' ? 3.25 : .75;
    const timeline = gsap.timeline({ defaults: { duration, ease: 'power2.inOut', onUpdate: update } });
    timeline.to(camera.position, { x: position[0], y: position[1], z: position[2] }, 0).to(aim.current, target, 0);
    return () => timeline.kill();
  }, [camera, size.width, size.height, intro, section, phase, reducedMotion, invalidate, regress]);
  /* eslint-enable react-hooks/immutability */
  return null;
}

function Ready({ onReady, onFailure }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas=gl.domElement;
    const lost = event => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    onReady();
    return()=>canvas.removeEventListener('webglcontextlost', lost);
  },[gl,onReady,onFailure]);
  return null;
}

export default function Scene({ onReady, onFailure, ...props }) {
  const [visible,setVisible] = useState(()=>!document.hidden);
  useEffect(()=>{ const update=()=>setVisible(!document.hidden); document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update); },[]);
  const small = window.matchMedia('(max-width: 767px)').matches;
  return <Canvas className="space-canvas" shadows={!small} dpr={[1,small?1.25:1.5]} frameloop={!visible?'never':props.reducedMotion?'demand':'always'} camera={{ position:[0,3.8,10.4], fov:40, near:.1, far:100 }} gl={{ antialias:!small, powerPreference:'high-performance', alpha:false }} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.shadowMap.type=THREE.PCFShadowMap;}}>
    <color attach="background" args={['#050e1b']}/>
    <AdaptiveDpr/>
    <ambientLight intensity={.6} color="#bdccdd"/>
    <hemisphereLight args={['#9bbdd7','#69533e',1.2]}/>
    <directionalLight position={[-3,7,5]} color="#ffe4c5" intensity={2} castShadow={!small} shadow-mapSize={[1024,1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-bias={-.001}/>
    <pointLight position={[0,5.5,0]} color="#ffb569" intensity={13} distance={11}/>
    <pointLight position={[-4,2.4,-1]} color="#ffb366" intensity={4} distance={5}/>
    <pointLight position={[4,2.4,-1]} color="#ffb366" intensity={4} distance={5}/>
    <directionalLight position={[0,4,-12]} color="#72a9e5" intensity={2}/>
    <Cabin reducedMotion={props.reducedMotion}/>
    <Objects {...props}/>
    <Robot phase={props.phase} reducedMotion={props.reducedMotion} onEntered={props.onEntered}/>
    <CameraController {...props}/><Ready onReady={onReady} onFailure={onFailure}/>
  </Canvas>;
}
