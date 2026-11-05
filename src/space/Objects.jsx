import { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { Cylinder, Screen } from './geometry';
import { colors, objectPositions } from './config';
import { createDisplay } from './textures';
import { sectionIds } from './navigation';
import { useSceneRender } from './render-context';
import ModelPart from './models';

function Roadmap() {
  const texture=useMemo(()=>createDisplay('roadmap'),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <group rotation={[0,.23,0]}><ModelPart part="RoadmapFrame"/><Screen texture={texture} size={[1.42,1.43]} position={[0,0,.157]}/></group>;
}

function Rocket({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const body=useRef();
  useEffect(()=>{const tween=gsap.to(body.current.position,{y:active?.18:0,duration:reducedMotion?0:.5*motionScale,ease:'power2.out',onUpdate:requestRender,onComplete:()=>requestRender(true)});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group><ModelPart part="RocketBase"/><group ref={body}><ModelPart part="RocketBody"/><Cylinder radius={.075} height={active?.22:.06} position={[0,.16,0]} color={colors.amber} glow={active?3:.5}/></group></group>;
}

function Logbook({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const cover=useRef();
  const pages=useRef([]);
  useEffect(()=>{
    const timeline=gsap.timeline({defaults:{duration:reducedMotion?0:.6*motionScale,ease:'power2.out'},onUpdate:requestRender,onComplete:()=>requestRender(true)});
    timeline.to(cover.current.rotation,{y:active?-1.05:0},0).to(pages.current.map(page=>page.rotation),{y:index=>active?-(.15+index*.12):0},0);
    return()=>timeline.kill();
  },[active,reducedMotion,requestRender,motionScale]);
  return <group name="logbook-lectern"><ModelPart part="Lectern"/>
    <group name="captains-log" position={[0,.85,0]} rotation={[-.6,-.08,-.06]}>
      <ModelPart part="BookBase"/>
      {Array.from({length:4},(_,i)=><group key={i} ref={node=>{pages.current[i]=node;}} position={[-.385,0,.135+i*.012]} name={`logbook-page-${i}`}><ModelPart part="BookPage"/></group>)}
      <group ref={cover} position={[-.44,0,.19]}><ModelPart part="BookCover"/></group>
    </group>
  </group>;
}

function Medal({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const medal=useRef();
  useEffect(()=>{const tween=gsap.to(medal.current.rotation,{z:active?-.08:0,duration:reducedMotion?0:.4*motionScale,onUpdate:requestRender,onComplete:()=>requestRender(true)});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group name="framed-medal" rotation={[0,1.05,0]}><ModelPart part="MedalFrame"/><group ref={medal} position={[0,0,.15]} scale={.84}><ModelPart part="MedalFace"/></group></group>;
}

function TechPanel({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const gear=useRef();
  const texture=useMemo(()=>createDisplay('console'),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useEffect(()=>{const tween=gsap.to(gear.current.rotation,{z:active?-Math.PI/2:0,duration:reducedMotion?0:.8*motionScale,onUpdate:requestRender,onComplete:()=>requestRender(true)});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group><ModelPart part="TechBase"/><group rotation={[-.25,0,0]} position={[0,.6,-.25]}>
    <Screen texture={texture} size={[1.4,.84]} position={[0,0,.131]}/>
    <group ref={gear} position={[0,0,.16]}><ModelPart part="TechGear"/></group>
  </group></group>;
}

function WallPhone({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const receiver=useRef();
  useEffect(()=>{const tween=gsap.to(receiver.current.position,{z:active?.28:.12,x:active?-.12:0,duration:reducedMotion?0:.5*motionScale,onUpdate:requestRender,onComplete:()=>requestRender(true)});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group rotation={[0,-.3,0]}><ModelPart part="PhoneBase"/><group ref={receiver} position={[0,0,.12]}><ModelPart part="PhoneReceiver"/></group></group>;
}

const objects = [Roadmap,Rocket,Logbook,Medal,TechPanel,WallPhone];

function InteractiveObject({ index, phase, section, onSelect, labels, reducedMotion, motionScale }) {
  const [hover,setHover]=useState(false);
  const id=sectionIds[index]; const Model=objects[index];
  const enabled=phase==='EXPLORE';
  const active=section===id&&phase!=='CLOSING_SECTION';
  useEffect(()=>()=>{document.body.style.cursor='';},[]);
  useEffect(()=>{if(!enabled)document.body.style.cursor='';},[enabled]);
  return <group position={objectPositions[index]} name={`object-${id}`} onPointerOver={event=>{if(enabled){event.stopPropagation();setHover(true);document.body.style.cursor='pointer';}}} onPointerOut={()=>{setHover(false);document.body.style.cursor='';}} onClick={event=>{if(enabled){event.stopPropagation();setHover(false);document.body.style.cursor='';onSelect(id);}}}>
    <Model active={active||hover} reducedMotion={reducedMotion} motionScale={motionScale}/>
    {hover&&enabled&&<Html center position={[0,index===3?-.95:1.45,.3]} style={{pointerEvents:'none'}}><span className="object-label">{labels.sections[index]}</span></Html>}
  </group>;
}

export default function Objects(props) { return <>{sectionIds.map((id,index)=><InteractiveObject key={id} index={index} {...props}/>)}</>; }
