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
  return <group position={[side*.23,.91,0]} rotation={[seated?-1.32:0,0,0]} ref={thighRef}>
    <ModelPart part={`RobotThigh${suffix}`}/>
    <group ref={kneeRef} rotation={[seated?1.35:0,0,0]} position={[0,-.46,0]}>
      <ModelPart part={`RobotShin${suffix}`}/>
    </group>
  </group>;
}

export default function Robot({ phase, reducedMotion, onEntered, motionScale }) {
  const requestRender = useSceneRender();
  const gl = useThree(state => state.gl);
  const root = useRef(); const head = useRef(); const left = useRef(); const right = useRef();
  const thighL = useRef(); const thighR = useRef(); const kneeL = useRef(); const kneeR = useRef();
  const [initiallySeated] = useState(() => !['INTRO','ENTERING'].includes(phase));
  const sequence = useRef(null);
  const motion = useRef(reducedMotion);
  const intro = phase === 'INTRO';
  useEffect(() => { motion.current = reducedMotion; if (reducedMotion) sequence.current?.progress(1); }, [reducedMotion]);
  useEffect(() => {
    if (intro || initiallySeated) return;
    const duration = motion.current ? .01 : motionScale;
    const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate: requestRender, onComplete: () => { requestRender(true); onEntered(); } });
    sequence.current = timeline;
    timeline.to(right.current.rotation, { z: 0, x: -.2, duration: .35*duration })
      .to(root.current.rotation, { y: Math.PI/2, duration: .55*duration })
      .to(root.current.position, { x: 0, z: .25, duration: 1.15*duration })
      .to(root.current.rotation, { y: Math.PI, duration: .5*duration })
      .to(root.current.position, { y: .22, duration: .65*duration }, 'sit')
      .to([thighL.current.rotation,thighR.current.rotation], { x: -1.32, duration: .65*duration }, 'sit')
      .to([kneeL.current.rotation,kneeR.current.rotation], { x: 1.35, duration: .65*duration }, 'sit')
      .to([left.current.rotation,right.current.rotation], { x: -.9, duration: .6*duration }, 'sit');
    return () => { timeline.kill(); sequence.current = null; };
  }, [intro, initiallySeated, onEntered, requestRender, motionScale]);

  useEffect(() => {
    if (!intro || reducedMotion) return;
    const wave = gsap.timeline({ onUpdate: requestRender, onComplete: () => requestRender(true) });
    wave.set(right.current.rotation, { x: -.48, z: .7 })
      .to(right.current.rotation, { z: 1.05, duration: .25*motionScale, yoyo: true, repeat: 3 })
      .to(right.current.rotation, { z: .7, duration: .25*motionScale });
    return () => wave.kill();
  }, [intro, reducedMotion, requestRender, motionScale]);

  useEffect(() => {
    if (reducedMotion || motionScale < 1 || !['INTRO','EXPLORE'].includes(phase)) return;
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
    if (!root.current || reducedMotion || phase !== 'ENTERING') return;
    const t = clock.elapsedTime;
    if (phase === 'ENTERING' && root.current.position.z > .3 && root.current.rotation.y > 1) {
      thighL.current.rotation.x = Math.sin(t*8)*.26;
      thighR.current.rotation.x = -Math.sin(t*8)*.26;
    }
  });
  return <group ref={root} position={initiallySeated?[0,.22,.25]:[-1.4,0,2.15]} rotation={[0,initiallySeated?Math.PI:-.08,0]} name="host-robot">
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
