import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import ModelPart from './models';
import { useSceneRender } from './render-context';

function Arm({ side, jointRef, seated }) {
  const suffix=side<0?'L':'R';
  return <group position={[side*.43,1.55,0]} rotation={[seated?-.9:0,0,0]} ref={jointRef}>
    <ModelPart part={`RobotUpperArm${suffix}`}/>
    <ModelPart part={`RobotLowerArm${suffix}`} position={[side*.1,-.48,0]}/>
  </group>;
}

function Leg({ side, thighRef, kneeRef, seated }) {
  const suffix=side<0?'L':'R';
  return <group name={`robot-thigh-${suffix}`} position={[side*.23,.91,0]} rotation={[seated?-1.32:0,0,0]} ref={thighRef}>
    <ModelPart part={`RobotThigh${suffix}`}/>
    <group name={`robot-knee-${suffix}`} ref={kneeRef} rotation={[seated?1.35:0,0,0]} position={[0,-.46,0]}>
      <ModelPart part={`RobotShin${suffix}`}/>
    </group>
  </group>;
}

export default function Robot({ phase, reducedMotion, onEntered, onHostReady, onHostToggle, motionScale }) {
  const requestRender = useSceneRender();
  const gl = useThree(state => state.gl);
  const root = useRef(); const head = useRef(); const left = useRef(); const right = useRef();
  const thighL = useRef(); const thighR = useRef(); const kneeL = useRef(); const kneeR = useRef();
  const [initiallySeated] = useState(() => !['INTRO','ENTERING'].includes(phase));
  const sequence = useRef(null);
  const intro = phase === 'INTRO' || phase === 'HOST_GREETING';
  useEffect(() => {
    const timeline = gsap.timeline({ paused:true, defaults: { ease: 'power2.inOut', immediateRender:false }, onUpdate: requestRender, onComplete: () => { requestRender(true); onEntered(); }, onReverseComplete: () => { requestRender(true); onHostReady(); } });
    sequence.current = timeline;
    timeline.fromTo(right.current.rotation,{z:.7,x:-.48},{z:0,x:-.2,duration:.35},0)
      .fromTo(root.current.rotation,{y:-.08},{y:Math.PI/2,duration:.55},.35)
      .fromTo(root.current.position,{x:-1.4,y:0,z:2.15},{x:0,y:0,z:.25,duration:1.15},.9)
      .fromTo(root.current.rotation,{y:Math.PI/2},{y:Math.PI,duration:.5},2.05)
      .fromTo(root.current.position,{y:0},{y:.22,duration:.65},2.55)
      .fromTo([thighL.current.rotation,thighR.current.rotation],{x:0},{x:-1.32,duration:.65},2.55)
      .fromTo([kneeL.current.rotation,kneeR.current.rotation],{x:0},{x:1.35,duration:.65},2.55)
      .fromTo(left.current.rotation,{x:0},{x:-.9,duration:.6},2.55)
      .fromTo(right.current.rotation,{x:-.2},{x:-.9,duration:.6},2.55);
    timeline.timeScale(1/motionScale).progress(initiallySeated?1:0,true).pause();
    return () => { timeline.kill(); sequence.current = null; };
  }, [initiallySeated, onEntered, onHostReady, requestRender, motionScale]);

  useEffect(() => {
    const timeline = sequence.current;
    const rising = phase === 'HOST_RISING';
    if (['ENTERING','HOST_SITTING','HOST_RISING'].includes(phase)) {
      if (reducedMotion) {
        timeline.pause().progress(rising?0:1,true);
        requestRender(true);
        if (rising) onHostReady(); else onEntered();
      } else if (rising) timeline.reverse(); else timeline.play();
    } else {
      timeline.pause().progress(intro?0:1,true);
      // Walking is applied during rendered frames; settle both legs at the endpoint.
      gsap.set([thighL.current.rotation,thighR.current.rotation],{x:intro?0:-1.32});
      gsap.set([kneeL.current.rotation,kneeR.current.rotation],{x:intro?0:1.35});
      requestRender(true);
    }
  }, [phase, intro, reducedMotion, motionScale, onHostReady, onEntered, requestRender]);

  useEffect(() => {
    if (!intro || reducedMotion) return;
    const wave = gsap.timeline({ onUpdate: requestRender, onComplete: () => requestRender(true) });
    wave.set(right.current.rotation, { x: -.48, z: .7 })
      .to(right.current.rotation, { z: 1.05, duration: .25*motionScale, yoyo: true, repeat: 3 })
      .to(right.current.rotation, { z: .7, duration: .25*motionScale });
    return () => wave.kill();
  }, [intro, reducedMotion, requestRender, motionScale]);

  useEffect(() => {
    if (reducedMotion || motionScale < 1 || !['INTRO','HOST_GREETING','EXPLORE'].includes(phase)) return;
    let last = 0, tween;
    const look = event => {
      if (event.timeStamp - last < 90) return;
      last = event.timeStamp;
      const rect = gl.domElement.getBoundingClientRect();
      const target = ((event.clientX - rect.left) / rect.width - .5) * .24;
      tween = gsap.to(head.current.rotation, { y: target, duration: .22, overwrite: true, onUpdate: requestRender });
    };
    gl.domElement.addEventListener('pointermove', look, { passive: true });
    return () => { gl.domElement.removeEventListener('pointermove', look); tween?.kill(); };
  }, [phase, reducedMotion, gl, requestRender, motionScale]);

  useFrame(({ clock }) => {
    if (!root.current || reducedMotion || !['ENTERING','HOST_RISING','HOST_SITTING'].includes(phase)) return;
    const t = clock.elapsedTime;
    if (root.current.position.z > .3 && root.current.rotation.y > 1) {
      thighL.current.rotation.x = Math.sin(t*8)*.26;
      thighR.current.rotation.x = -Math.sin(t*8)*.26;
    }
  });
  return <group ref={root} position={initiallySeated?[0,.22,.25]:[-1.4,0,2.15]} rotation={[0,initiallySeated?Math.PI:-.08,0]} name="host-robot">
    <mesh name="robot-hitbox" position={[0,1.4,0]} onClick={event=>{if(['EXPLORE','HOST_GREETING'].includes(phase)&&event.button===0&&event.delta<=4){event.stopPropagation();onHostToggle();}}}>
      <boxGeometry args={[1.4,2.8,1.2]}/><meshBasicMaterial visible={false}/>
    </mesh>
    <ModelPart part="RobotTorso"/>
    <group ref={head} position={[0,2.26,0]}>
      <ModelPart part="RobotHead"/>
      <group name="robot-ear" position={[.66,0,0]}/>
      <group name="robot-left-ear" position={[-.66,0,0]}/>
    </group>
    <Arm side={-1} jointRef={left} seated={initiallySeated}/><Arm side={1} jointRef={right} seated={initiallySeated}/>
    <Leg side={-1} thighRef={thighL} kneeRef={kneeL} seated={initiallySeated}/><Leg side={1} thighRef={thighR} kneeRef={kneeR} seated={initiallySeated}/>
  </group>;
}
