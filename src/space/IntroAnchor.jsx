import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector3 } from 'three';

export default function IntroAnchor({ dialogRef }) {
  const point = useMemo(() => new Vector3(), []);
  useFrame(({ scene, camera, size }) => {
    const dialog = dialogRef.current;
    const ear = scene.getObjectByName('robot-ear');
    if (!dialog || !ear) return;
    ear.getWorldPosition(point).project(camera);
    const x = (point.x + 1) * size.width / 2;
    const y = (1 - point.y) * size.height / 2;
    const left = Math.max(12, Math.min(size.width - dialog.offsetWidth - 12, x + 16));
    const top = Math.max(12, Math.min(size.height - dialog.offsetHeight - 44, y - 52));
    dialog.style.setProperty('--dialog-x', `${left}px`);
    dialog.style.setProperty('--dialog-y', `${top}px`);
    dialog.style.setProperty('--tail-y', `${Math.max(14, Math.min(dialog.offsetHeight - 22, y - top - 8))}px`);
    dialog.dataset.anchored = 'true';
  });
  return null;
}
