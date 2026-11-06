import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import Cabin from './Cabin';
import Robot from './Robot';
import Objects from './Objects';
import { objectPositions } from './config';
import { sectionIds } from './navigation';
import RenderBudget from './RenderBudget';
import { useSceneRender } from './render-context';
import IntroAnchor from './IntroAnchor';
import { isSoftwareRenderer } from './render-budget';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

gsap.ticker.fps(24);

function CameraController({ phase, section, reducedMotion, motionScale, resetView }) {
  const { camera, size, gl, set } = useThree();
  const requestRender = useSceneRender();
  const controls = useMemo(() => new OrbitControls(camera), [camera]);
  const previous = useRef(null);
  const userPose = useRef(null);
  // Three.js camera objects are mutable scene resources, outside React's state model.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    controls.connect(gl.domElement);
    controls.enableDamping = false;
    controls.minAzimuthAngle = -.5; controls.maxAzimuthAngle = .5;
    controls.minPolarAngle = 1.14; controls.maxPolarAngle = 1.56;
    controls.minDistance = 8; controls.maxDistance = 16.5;
    controls.cursor.set(0,2.45,-1.3); controls.maxTargetRadius = 1.6;
    controls.rotateSpeed = .55; controls.panSpeed = .6; controls.zoomSpeed = .7;
    controls.target.set(0,2.45,-1.3);
    controls.addEventListener('change', requestRender);
    set({ controls });
    return () => { controls.removeEventListener('change', requestRender); controls.dispose(); set({controls:null}); };
  }, [controls,gl,set,requestRender]);
  useEffect(() => {
    const last = previous.current;
    const resized = !last || last.width !== size.width || last.height !== size.height;
    const reset = last?.resetView !== resetView;
    previous.current = {phase, width:size.width, height:size.height, resetView};
    const manual = ['EXPLORE','HOST_GREETING'].includes(phase);
    controls.enabled = manual;
    controls.maxTargetRadius = manual ? 1.6 : Infinity;
    if (!resized && !reset && ((phase === 'EXPLORE' && last?.phase === 'EXPLORE') || phase === 'HOST_GREETING')) return;
    if (resized) userPose.current = null;
    if (phase === 'OPENING_SECTION' && last?.phase === 'EXPLORE' && !resized) userPose.current = {position:camera.position.clone(), target:controls.target.clone()};
    const portrait = size.width / size.height < 1;
    const intro = ['INTRO','HOST_RISING','HOST_GREETING'].includes(phase);
    const index = sectionIds.indexOf(section);
    const focusing = index >= 0 && phase !== 'CLOSING_SECTION';
    const objectX = focusing ? objectPositions[index][0] : 0;
    let position = new THREE.Vector3(...(portrait ? [objectX*.32, 4.5, 12] : [objectX*.09, intro ? 3.8 : 4.25, intro ? 10.4 : 10.6]));
    let target = new THREE.Vector3(portrait ? objectX*.45 : objectX*.15, portrait ? 2.3 : 2.45, -1.3);
    const restoring = phase === 'CLOSING_SECTION' || (phase === 'EXPLORE' && last?.phase === 'CLOSING_SECTION');
    if (restoring && userPose.current && !resized) ({position,target} = userPose.current);
    camera.fov = portrait ? 47 : 40;
    camera.updateProjectionMatrix();
    controls.enabled = false;
    controls.maxTargetRadius = Infinity;
    const update = () => { controls.update(); requestRender(); };
    // Panel timers can finish before a native-speed camera tween; complete its endpoint.
    const continuing = phase === 'SECTION_OPEN' || (phase === 'EXPLORE' && last?.phase === 'CLOSING_SECTION');
    const duration = reducedMotion ? 0 : (phase === 'ENTERING' ? 3.25 : continuing ? .25 : .75) * motionScale;
    if (!duration) {
      camera.position.copy(position); controls.target.copy(target); controls.update();
      controls.enabled = manual; controls.maxTargetRadius = manual ? 1.6 : Infinity; requestRender(true);
      return;
    }
    const timeline = gsap.timeline({ defaults: { duration, ease: 'power2.inOut', onUpdate: update }, onComplete: () => { controls.enabled = manual; controls.maxTargetRadius = manual ? 1.6 : Infinity; requestRender(true); } });
    timeline.to(camera.position, { x: position.x, y: position.y, z: position.z }, 0).to(controls.target, {x:target.x,y:target.y,z:target.z}, 0);
    return () => timeline.kill();
  }, [camera, controls, size.width, size.height, section, phase, reducedMotion, motionScale, resetView, requestRender]);
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

export default function Scene({ onReady, onFailure, dialogRef, ...props }) {
  const [visible,setVisible] = useState(()=>!document.hidden);
  const [software, setSoftware] = useState(false);
  useEffect(()=>{ const update=()=>setVisible(!document.hidden); document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update); },[]);
  const small = window.matchMedia('(max-width: 767px)').matches;
  const motionScale = software ? .25 : 1;
  return <Canvas className="space-canvas" shadows={!small} dpr={software?.8:[1,small?1:1.25]} frameloop={visible?'demand':'never'} camera={{ position:[0,3.8,10.4], fov:40, near:.1, far:100 }} gl={{ antialias:!small, powerPreference:'low-power', alpha:false }} onCreated={({gl})=>{setSoftware(isSoftwareRenderer(gl));gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.shadowMap.type=THREE.PCFShadowMap;gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;}}>
    <RenderBudget>
    <color attach="background" args={['#050e1b']}/>
    <ambientLight intensity={.45} color="#bdccdd"/>
    <hemisphereLight args={['#b9d1df','#69533e',1.4]}/>
    <directionalLight position={[-3,7,5]} color="#ffe4c5" intensity={2} castShadow={!small} shadow-mapSize={software?[512,512]:[1024,1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-bias={-.001}/>
    <directionalLight position={[0,4,-12]} color="#72a9e5" intensity={2}/>
    <Cabin/>
    <Objects {...props} motionScale={motionScale}/>
    <Robot phase={props.phase} reducedMotion={props.reducedMotion} onEntered={props.onEntered} onHostReady={props.onHostReady} onHostToggle={props.onHostToggle} motionScale={motionScale}/>
    <CameraController {...props} motionScale={motionScale}/><Ready onReady={onReady} onFailure={onFailure}/>
    {['INTRO','HOST_GREETING'].includes(props.phase) && <IntroAnchor dialogRef={dialogRef}/>}
    </RenderBudget>
  </Canvas>;
}
