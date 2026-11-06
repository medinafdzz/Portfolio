import { useEffect, useMemo, useRef, useState } from 'react';
import { Html } from '@react-three/drei/web/Html.js';
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
  return <group rotation={[0,.23,0]}><ModelPart part="RoadmapSupport"/><ModelPart part="RoadmapFrame"/><Screen texture={texture} size={[1.42,1.43]} position={[0,0,.157]}/></group>;
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
  return <group name="framed-medal" rotation={[0,1.05,0]}><ModelPart part="MedalFrame"/><group ref={medal} position={[0,0,.15]} scale={.84}><ModelPart part="MedalFace"/><ModelPart part="MedalNumber"/></group></group>;
}

function Laptop({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const lid=useRef();
  const texture=useMemo(()=>createDisplay('gear'),[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  useEffect(()=>{const tween=gsap.to(lid.current.rotation,{x:active?-.18:Math.PI/2,duration:reducedMotion?0:.65*motionScale,ease:'power2.inOut',onUpdate:requestRender});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group name="tech-laptop"><ModelPart part="LaptopBase"/><group ref={lid} name="laptop-lid" rotation={[Math.PI/2,0,0]} position={[0,.22,-.48]}>
    <ModelPart part="LaptopLid"/>
    <Screen texture={texture} size={[1.46,.79]} position={[0,.53,.059]}/>
  </group></group>;
}

function WallPhone({ active, reducedMotion, motionScale }) {
  const requestRender=useSceneRender();
  const receiver=useRef();
  useEffect(()=>{const tween=gsap.to(receiver.current.position,{z:active?.28:.12,x:active?-.12:0,duration:reducedMotion?0:.5*motionScale,onUpdate:requestRender,onComplete:()=>requestRender(true)});return()=>tween.kill();},[active,reducedMotion,requestRender,motionScale]);
  return <group rotation={[0,-.3,0]}><ModelPart part="PhoneBase"/><group ref={receiver} position={[0,0,.12]}><ModelPart part="PhoneReceiver"/></group></group>;
}

const objects = [Roadmap,Rocket,Logbook,Medal,Laptop,WallPhone];
const hitboxes = [
  {size:[1.8,1.85,.6],position:[0,0,.05]},
  {size:[1.1,1.95,1.1],position:[0,.9,0]},
  {size:[1.2,1.6,1.3],position:[0,.8,.1]},
  {size:[1.16,1.16,.65],position:[0,0,0],rotation:[0,1.05,0]},
  {size:[1.7,1.4,1.1],position:[0,.6,-.1]},
  {size:[1.3,2.65,1.1],position:[-.12,-.32,.3],rotation:[0,-.3,0]},
];

function InteractiveObject({ index, phase, section, onSelect, labels, reducedMotion, motionScale }) {
  const [hover,setHover]=useState(false);
  const id=sectionIds[index]; const Model=objects[index];
  const hitbox=hitboxes[index];
  const enabled=phase==='EXPLORE';
  const active=section===id&&phase!=='CLOSING_SECTION';
  useEffect(()=>()=>{document.body.style.cursor='';},[]);
  useEffect(()=>{if(!enabled)document.body.style.cursor='';},[enabled]);
  return <group position={objectPositions[index]} name={`object-${id}`} onPointerOver={event=>{if(enabled){event.stopPropagation();setHover(true);document.body.style.cursor='pointer';}}} onPointerOut={()=>{setHover(false);document.body.style.cursor='';}} onClick={event=>{if(enabled&&event.button===0&&event.delta<=4){event.stopPropagation();setHover(false);document.body.style.cursor='';onSelect(id);}}}>
    <Model active={active||hover} reducedMotion={reducedMotion} motionScale={motionScale}/>
    <mesh name={`${id}-hitbox`} position={hitbox.position} rotation={hitbox.rotation}>
      <boxGeometry args={hitbox.size}/><meshBasicMaterial visible={false}/>
    </mesh>
    {hover&&enabled&&<Html center position={[0,index===3?-.95:1.45,.3]} style={{pointerEvents:'none'}}><span className="object-label">{labels.sections[index]}</span></Html>}
  </group>;
}

export default function Objects(props) { return <>{sectionIds.map((id,index)=><InteractiveObject key={id} index={index} {...props}/>)}</>; }
