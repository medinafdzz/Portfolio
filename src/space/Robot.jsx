import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import {CanvasTexture} from 'three';
import gsap from 'gsap';
import ModelPart from './models';
import { useSceneRender } from './render-context';
import {robotPose} from './robot-pose';

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
  const waist=useRef(); const shadow=useRef();
  const thighL = useRef(); const thighR = useRef(); const kneeL = useRef(); const kneeR = useRef();
  const [initiallySeated] = useState(() => !['INTRO','ENTERING'].includes(phase));
  const sequence = useRef(null);
  const rising=useRef(false);
  const travel=useMemo(()=>({value:initiallySeated?1:0}),[initiallySeated]);
  const contact=useMemo(()=>{
    const canvas=document.createElement('canvas'); canvas.width=canvas.height=64;
    const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,0,32,32,32);
    gradient.addColorStop(0,'#0009'); gradient.addColorStop(1,'#0000');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
    return new CanvasTexture(canvas);
  },[]);
  useEffect(()=>()=>contact.dispose(),[contact]);
  const updatePose=useCallback(()=>{
    const pose=robotPose(travel.value,rising.current);
    root.current.position.set(pose.x,pose.y,pose.z); root.current.rotation.y=pose.yaw;
    thighL.current.rotation.x=pose.thighL; thighR.current.rotation.x=pose.thighR;
    kneeL.current.rotation.x=pose.kneeL; kneeR.current.rotation.x=pose.kneeR;
    left.current.rotation.x=pose.armL; right.current.rotation.x=pose.armR; right.current.rotation.z=pose.wave;
    waist.current.rotation.x=pose.lean;
    shadow.current.position.set(pose.x,-.045,pose.z);
    requestRender();
  },[travel,requestRender]);
  const intro = phase === 'INTRO' || phase === 'HOST_GREETING';
  useEffect(() => {
    const timeline = gsap.timeline({ paused:true, onUpdate:updatePose, onComplete:onEntered, onReverseComplete:onHostReady });
    sequence.current = timeline;
    timeline.fromTo(travel,{value:0},{value:1,duration:3.4,ease:'none',immediateRender:false});
    timeline.timeScale(1/motionScale).progress(initiallySeated?1:0,true).pause();
    updatePose();
    return () => { timeline.kill(); sequence.current = null; };
  }, [initiallySeated, onEntered, onHostReady, updatePose, motionScale, travel]);

  useEffect(() => {
    const timeline = sequence.current;
    const backwards = phase === 'HOST_RISING';
    rising.current=backwards;
    if (['ENTERING','HOST_SITTING','HOST_RISING'].includes(phase)) {
      if (reducedMotion) {
        timeline.pause().progress(backwards?0:1,true);
        updatePose();
        if (backwards) onHostReady(); else onEntered();
      } else if (backwards) timeline.reverse(); else timeline.play();
    } else {
      timeline.pause().progress(intro?0:1,true);
      updatePose();
    }
  }, [phase, intro, reducedMotion, motionScale, onHostReady, onEntered, updatePose]);

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

  return <group><mesh ref={shadow} name="robot-contact-shadow" rotation={[-Math.PI/2,0,0]} scale={[1.3,.9,1]}>
    <planeGeometry args={[2,2]}/><meshBasicMaterial map={contact} transparent depthWrite={false} toneMapped={false}/>
  </mesh><group ref={root} name="host-robot">
    <mesh name="robot-hitbox" position={[0,1.4,0]} onClick={event=>{if(['EXPLORE','HOST_GREETING'].includes(phase)&&event.button===0&&event.delta<=4){event.stopPropagation();onHostToggle();}}}>
      <boxGeometry args={[1.4,2.8,1.2]}/><meshBasicMaterial visible={false}/>
    </mesh>
    <group ref={waist} position={[0,.91,0]}><group position={[0,-.91,0]}><ModelPart part="RobotTorso"/>
    <group ref={head} position={[0,2.26,0]}>
      <ModelPart part="RobotHead"/>
      <group name="robot-ear" position={[.66,0,0]}/>
      <group name="robot-left-ear" position={[-.66,0,0]}/>
    </group>
    <Arm side={-1} jointRef={left} seated={initiallySeated}/><Arm side={1} jointRef={right} seated={initiallySeated}/>
    </group></group>
    <Leg side={-1} thighRef={thighL} kneeRef={kneeL} seated={initiallySeated}/><Leg side={1} thighRef={thighR} kneeRef={kneeR} seated={initiallySeated}/>
  </group></group>;
}
