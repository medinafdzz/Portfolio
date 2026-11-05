import { useEffect, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { colors } from './config';

export function Block({ size = [1, 1, 1], color = colors.shell, radius = .08, metalness = .25, roughness = .5, glow = 0, ...props }) {
  return <RoundedBox args={size} radius={Math.min(radius, ...size.map(x => x / 2.1))} smoothness={3} bevelSegments={2} castShadow receiveShadow {...props}><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} emissive={color} emissiveIntensity={glow}/></RoundedBox>;
}
export function Orb({ size = [1, 1, 1], color = colors.white, ...props }) {
  return <mesh scale={size} castShadow receiveShadow {...props}><sphereGeometry args={[1, 24, 16]}/><meshStandardMaterial color={color} metalness={.24} roughness={.36}/></mesh>;
}
export function Cylinder({ radius = .2, height = .3, color = colors.shell, top, glow = 0, ...props }) {
  return <mesh castShadow receiveShadow {...props}><cylinderGeometry args={[top ?? radius, radius, height, 24]}/><meshStandardMaterial color={color} metalness={.45} roughness={.36} emissive={color} emissiveIntensity={glow}/></mesh>;
}
export function Tube({ points, radius = .02, color = colors.amber, glow = 0, ...props }) {
  const geometry = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), Math.max(16, points.length * 3), radius, 8, false), [points, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} {...props}><meshStandardMaterial color={color} metalness={.4} roughness={.4} emissive={color} emissiveIntensity={glow}/></mesh>;
}
export function Ring({ radius = .2, tube = .02, color = colors.amber, glow = 0, ...props }) {
  return <mesh {...props}><torusGeometry args={[radius, tube, 10, 64]}/><meshStandardMaterial color={color} metalness={.5} roughness={.3} emissive={color} emissiveIntensity={glow}/></mesh>;
}
export function Screen({ size = [1, .6], texture, ...props }) {
  return <mesh {...props}><planeGeometry args={size}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
