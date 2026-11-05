import { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { Block, Cylinder, Orb, Ring, Screen, Tube } from './geometry';
import { colors, objectPositions } from './config';
import { createDisplay } from './textures';
import { sectionIds } from './navigation';

function Roadmap({ active }) {
  const texture = useMemo(()=>createDisplay('roadmap'),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <group rotation={[0,.23,0]}><Block size={[1.65,1.7,.18]} color={active ? colors.amber : '#9c815f'} radius={.12}/><Block size={[1.55,1.6,.08]} position={[0,0,.11]} color={colors.dark}/><Screen texture={texture} size={[1.42,1.43]} position={[0,0,.157]}/>{[-1,1].map(side=><Cylinder key={side} radius={.022} height={.02} color={colors.steel} position={[side*.72,.72,.17]} rotation={[Math.PI/2,0,0]}/>)}</group>;
}

function Rocket({ active, reducedMotion }) {
  const body = useRef();
  useEffect(()=>{ const tween=gsap.to(body.current.position,{y:active?.18:0,duration:reducedMotion?0:.5,ease:'power2.out'});return()=>tween.kill();},[active,reducedMotion]);
  return <group><Cylinder radius={.53} height={.13} color={colors.dark}/><Cylinder radius={.45} height={.06} position={[0,.09,0]} color="#ac8c5f"/><Ring radius={.36} tube={.026} position={[0,.13,0]} rotation={[Math.PI/2,0,0]} glow={active?3:1}/><group ref={body}>
    <Cylinder radius={.22} top={.25} height={.67} position={[0,.75,0]} color={colors.white}/><Cylinder radius={.25} top={0} height={.46} position={[0,1.31,0]} color="#c9d2d1"/>
    <Cylinder radius={.1} top={0} height={.2} position={[0,1.44,0]} color={colors.dark}/><Cylinder radius={.15} top={.1} height={.25} position={[0,.3,0]} color="#515a61"/>
    {[-1,1].map(side=><Block key={side} size={[.1,.51,.37]} position={[side*.22,.46,0]} rotation={[0,0,-side*.28]} color="#a2a9ab" radius={.045}/>)}
    <Ring radius={.117} tube={.024} position={[0,.82,.244]} color={colors.steel}/><Orb size={[.09,.09,.04]} position={[0,.82,.25]} color="#194056"/>
    <Orb size={[.08,active?.2:.08,.08]} position={[0,.17,0]} color={colors.amber}/>
  </group></group>;
}

function Logbook({ active, reducedMotion }) {
  const cover=useRef();
  useEffect(()=>{const tween=gsap.to(cover.current.rotation,{y:active?-1.05:0,duration:reducedMotion?0:.6});return()=>tween.kill();},[active,reducedMotion]);
  return <group rotation={[-1.08,-.08,-.06]}><Block size={[.88,1.02,.11]} color="#202e3c" radius={.035}/><Block size={[.77,.91,.13]} position={[0,0,.1]} color="#d5d0b8" radius={.01}/>{Array.from({length:4},(_,i)=><Block key={i} size={[.76,.005,.01]} position={[0,-.35+i*.19,.17]} color="#a29d90" radius={.001}/>)}<group ref={cover} position={[-.44,0,.19]}><Block size={[.88,1.02,.07]} position={[.44,0,0]} color="#273c50" radius={.035}/><Ring radius={.12} tube={.023} position={[.44,.12,.043]} color="#ddad64"/><Block size={[.15,.035,.015]} position={[.44,-.13,.045]} color="#ddad64"/><Block size={[.36,.022,.015]} position={[.44,-.3,.045]} color="#a6adb4"/></group><Block size={[.15,.3,.07]} position={[.45,0,.23]} color="#6c7379" radius={.025}/></group>;
}

function Medal({ active, reducedMotion }) {
  const medal=useRef();
  useFrame(({clock})=>{if(!reducedMotion){medal.current.rotation.y=Math.sin(clock.elapsedTime*(active?2:.5))*(active?.45:.045);medal.current.rotation.z=Math.sin(clock.elapsedTime*.8)*.035;}});
  return <group><Block size={[.14,.83,.055]} position={[0,.52,0]} color="#ac783a"/><Ring radius={.065} tube={.018} position={[0,.075,0]} color="#d7a056"/><group ref={medal} position={[0,-.38,0]}><Cylinder radius={.4} height={.085} rotation={[Math.PI/2,0,0]} color="#ba803e"/><Ring radius={.36} tube={.025} position={[0,0,.06]} color="#f2c475" glow={.5}/><Block size={[.32,.055,.22]} rotation={[.3,0,Math.PI/4]} position={[0,.055,.1]} color="#f2cf89" radius={.008}/><Block size={[.22,.14,.05]} position={[0,-.06,.13]} color="#dfb46c"/>{[-1,1].map(side=><group key={side}>{Array.from({length:5},(_,i)=><Orb key={i} size={[.022,.05,.012]} rotation={[0,0,side*(.3+i*.12)]} position={[side*(.22+Math.sin(i*.6)*.025),-.19+i*.075,.07]} color="#f0be70"/>)}</group>)}</group></group>;
}

function TechPanel({ active, reducedMotion }) {
  const gear=useRef();
  const texture=useMemo(()=>createDisplay('console'),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useFrame((_,delta)=>{if(active&&!reducedMotion)gear.current.rotation.z-=delta*.9;});
  return <group><Block size={[1.6,.16,1]} color={colors.dark}/><group rotation={[-.25,0,0]} position={[0,.6,-.25]}><Block size={[1.6,1.04,.15]} color={active?colors.amber:'#b7976d'}/><Block size={[1.5,.94,.09]} position={[0,0,.08]} color={colors.dark}/><Screen texture={texture} size={[1.4,.84]} position={[0,0,.131]}/><group ref={gear} position={[0,0,.16]}><Ring radius={.24} tube={.035} color="#a8dff4" glow={1}/><Ring radius={.12} tube={.025} color="#a8dff4" glow={1}/>{Array.from({length:10},(_,i)=><group key={i} rotation={[0,0,i/10*Math.PI*2]}><Block size={[.09,.1,.035]} position={[0,.26,0]} color="#9cd4ef" radius={.01} glow={1}/></group>)}</group></group>{[-.5,0,.5].map((x,i)=><Block key={x} size={[.15,.03,.06]} position={[x,.1,.37]} color={i===1?colors.blue:colors.amber} glow={1.6}/>)}</group>;
}

function WallPhone({ active, reducedMotion }) {
  const receiver=useRef();
  useEffect(()=>{const tween=gsap.to(receiver.current.position,{z:active?.28:.12,x:active?-.12:0,duration:reducedMotion?0:.5});return()=>tween.kill();},[active,reducedMotion]);
  const cord=useMemo(()=>Array.from({length:180},(_,i)=>{const t=i/179;return [.09+Math.sin(t*Math.PI*42)*.055,-.68-t*.62,Math.cos(t*Math.PI*42)*.035+.1];}),[]);
  return <group rotation={[0,-.3,0]}><Block size={[.58,1.48,.18]} color="#a18b6f"/><Block size={[.45,1.36,.12]} position={[0,0,.12]} color="#2b343d"/><Block size={[.035,.68,.04]} position={[.2,0,.2]} color={colors.amber} glow={active?3:1.5}/><group ref={receiver} position={[0,0,.12]}><Block size={[.2,.72,.15]} position={[-.06,0,.12]} color="#1d252d" radius={.07}/>{[-1,1].map(side=><Block key={side} size={[.31,.3,.26]} position={[-.06,side*.47,.14]} color="#252e35" radius={.1}/>)}</group><Tube points={cord} radius={.014} color="#101820"/><Tube points={[[.09,-1.3,.1],[.12,-1.43,.1],[.27,-1.3,.1],[.27,-.5,.05]]} radius={.015} color="#111923"/></group>;
}

const objects = [Roadmap,Rocket,Logbook,Medal,TechPanel,WallPhone];

function InteractiveObject({ index, phase, section, onSelect, labels, reducedMotion }) {
  const [hover,setHover]=useState(false);
  const id=sectionIds[index]; const Model=objects[index];
  const enabled=['INTRO','EXPLORE'].includes(phase);
  const active=section===id&&phase!=='CLOSING_SECTION';
  useEffect(()=>()=>{document.body.style.cursor='';},[]);
  useEffect(()=>{if(!enabled)document.body.style.cursor='';},[enabled]);
  return <group position={objectPositions[index]} name={`object-${id}`} onPointerOver={event=>{if(enabled){event.stopPropagation();setHover(true);document.body.style.cursor='pointer';}}} onPointerOut={()=>{setHover(false);document.body.style.cursor='';}} onClick={event=>{if(enabled){event.stopPropagation();setHover(false);document.body.style.cursor='';onSelect(id);}}}>
    <Model active={active||hover} reducedMotion={reducedMotion}/>
    {hover&&enabled&&<Html center position={[0,index===3?-.95:1.45,.3]} style={{pointerEvents:'none'}}><span className="object-label">{labels.sections[index]}</span></Html>}
    {hover&&<pointLight position={[0,.4,1]} color={colors.amber} intensity={1.1} distance={2.8}/>}
  </group>;
}

export default function Objects(props) { return <>{sectionIds.map((id,index)=><InteractiveObject key={id} index={index} {...props}/>)}</>; }
