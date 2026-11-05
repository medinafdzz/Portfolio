import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const modelUrl='/models/spacefolio.glb';
const decoder=new DRACOLoader().setDecoderPath('/draco/').setWorkerLimit(2);
const configure=loader=>loader.setDRACOLoader(decoder);
const ignoreRaycast=()=>{};

export default function ModelPart({ part, ...props }) {
  const {nodes}=useGLTF(modelUrl,false,false,configure);
  const object=useMemo(()=>{
    const clone=nodes[part].clone(true);
    clone.traverse(node=>{
      if(!node.isMesh)return;
      node.castShadow=part.startsWith('Robot');
      // The floor receives the cached contact shadow; self-shadowing tiny
      // bevels at a 512px software shadow map introduces visible acne.
      node.receiveShadow=false;
      node.raycast=ignoreRaycast;
      if(node.material.map)node.material.map.anisotropy=4;
    });
    return clone;
  },[nodes,part]);
  // Clones share the cached GLB geometry/materials, including the four pages.
  return <group {...props} dispose={null}><primitive object={object}/></group>;
}

useGLTF.preload(modelUrl,false,false,configure);
