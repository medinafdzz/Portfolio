import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { Block, Cylinder, Orb, Ring } from './geometry';
import { colors } from './config';

function Arm({ side, jointRef }) {
  return <group position={[side*.43,1.55,0]} ref={jointRef}>
    <Orb size={[.17,.17,.17]} color="#30373d"/>
    <Block size={[.25,.44,.27]} position={[side*.06,-.23,0]} color={colors.white} radius={.11}/>
    <group position={[side*.1,-.48,0]}><Orb size={[.12,.12,.12]} color="#4b5158"/><Block size={[.23,.36,.26]} position={[0,-.2,.01]} color={colors.white} radius={.09}/><Block size={[.25,.18,.22]} position={[0,-.47,.035]} color="#9fa7ac" radius={.075}/>{[-1,0,1].map(i=><Block key={i} size={[.052,.15,.07]} position={[i*.073,-.59,.07]} color="#c7cdcc" radius={.025}/>)}</group>
  </group>;
}

function Leg({ side, thighRef, kneeRef }) {
  return <group position={[side*.23,.91,0]} ref={thighRef}><Orb size={[.19,.19,.19]} color="#303740"/><Block size={[.34,.43,.36]} position={[0,-.23,0]} color={colors.white} radius={.13}/><group ref={kneeRef} position={[0,-.46,0]}><Cylinder radius={.15} height={.34} rotation={[0,0,Math.PI/2]} color="#a8afb2"/><Block size={[.34,.32,.35]} position={[0,-.2,0]} color={colors.white} radius={.12}/><Block size={[.4,.18,.55]} position={[0,-.41,.09]} color="#c4cbcc" radius={.085}/><Block size={[.4,.055,.53]} position={[0,-.5,.09]} color="#343b43" radius={.025}/></group></group>;
}

export default function Robot({ phase, reducedMotion, onEntered }) {
  const root = useRef(); const head = useRef(); const left = useRef(); const right = useRef();
  const thighL = useRef(); const thighR = useRef(); const kneeL = useRef(); const kneeR = useRef();
  const hasEntered = useRef(false);
  useEffect(() => {
    if (phase === 'INTRO') return;
    if (hasEntered.current) return;
    hasEntered.current = true;
    const duration = reducedMotion ? .01 : 1;
    const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: onEntered });
    timeline.to(right.current.rotation, { z: 0, x: -.2, duration: .35*duration })
      .to(root.current.rotation, { y: Math.PI/2, duration: .55*duration })
      .to(root.current.position, { x: 0, z: .25, duration: 1.15*duration })
      .to(root.current.rotation, { y: Math.PI, duration: .5*duration })
      .to(root.current.position, { y: .22, duration: .65*duration }, 'sit')
      .to([thighL.current.rotation,thighR.current.rotation], { x: -1.32, duration: .65*duration }, 'sit')
      .to([kneeL.current.rotation,kneeR.current.rotation], { x: 1.35, duration: .65*duration }, 'sit')
      .to([left.current.rotation,right.current.rotation], { x: -.9, duration: .6*duration }, 'sit');
    return () => { timeline.kill(); hasEntered.current = false; };
  }, [phase === 'INTRO', reducedMotion, onEntered]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock, pointer }, delta) => {
    if (!root.current || reducedMotion) return;
    const t = clock.elapsedTime;
    head.current.rotation.y += (pointer.x*.12 - head.current.rotation.y)*Math.min(delta*3,1);
    head.current.rotation.x = Math.sin(t*.65)*.018;
    if (phase === 'INTRO') {
      right.current.rotation.z = .7 + Math.sin(t*2.2)*.13;
      right.current.rotation.x = -.48;
      left.current.rotation.z = -.08 + Math.sin(t)*.025;
    }
    if (phase === 'ENTERING' && root.current.position.z > .3 && root.current.rotation.y > 1) {
      thighL.current.rotation.x = Math.sin(t*8)*.26;
      thighR.current.rotation.x = -Math.sin(t*8)*.26;
    }
  });
  return <group ref={root} position={[-1.4,0,2.15]} rotation={[0,-.08,0]} name="host-robot">
    <Orb size={[.36,.23,.27]} position={[0,.97,0]} color="#343b42"/>
    <Block size={[.76,.72,.5]} position={[0,1.39,0]} color={colors.white} radius={.19}/>
    <Block size={[.51,.36,.035]} position={[0,1.4,.266]} color="#d3d9d7" radius={.085}/><Ring radius={.08} tube={.017} position={[0,1.5,.29]} glow={1.3}/>
    <Block size={[.46,.27,.04]} position={[0,1.43,-.265]} color="#a7b0b5" radius={.03}/>{[-1,0,1].map(i=><Block key={i} size={[.3,.022,.02]} position={[0,1.35+i*.055,-.3]} color="#3b454e" radius={.005}/>)}
    <Cylinder radius={.14} height={.24} position={[0,1.88,0]} color="#363d44"/>
    <group ref={head} position={[0,2.26,0]}>
      <Block size={[1.13,.89,.85]} color="#e1e5e2" radius={.32}/>
      <Block size={[.99,.7,.18]} position={[0,-.015,.395]} color="#202932" radius={.23} metalness={.5} roughness={.22}/>
      <Block size={[.9,.59,.07]} position={[0,-.018,.495]} color="#07121c" radius={.2} metalness={.55} roughness={.14}/>
      {[-1,1].map(side=><group key={side}><Block size={[.075,.23,.04]} position={[side*.23,-.005,.54]} color="#a5e3f4" radius={.035} glow={2.8}/><Cylinder radius={.235} height={.09} rotation={[0,0,Math.PI/2]} position={[side*.6,0,0]} color="#656e74"/><Ring radius={.175} tube={.023} rotation={[0,Math.PI/2,0]} position={[side*.66,0,0]} glow={2}/></group>)}
      <Block size={[.44,.23,.035]} position={[0,-.07,-.438]} color="#bcc5c6" radius={.07}/>
    </group>
    <Arm side={-1} jointRef={left}/><Arm side={1} jointRef={right}/>
    <Leg side={-1} thighRef={thighL} kneeRef={kneeL}/><Leg side={1} thighRef={thighR} kneeRef={kneeR}/>
  </group>;
}
