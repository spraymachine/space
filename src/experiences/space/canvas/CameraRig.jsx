import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_POSITIONS } from './constants';

const WAYPOINTS = [
  { at: 0.00, pos: [0, 0, 5],    look: PLANET_POSITIONS.earth },
  { at: 0.10, pos: [0, 0, 2],    look: PLANET_POSITIONS.earth },
  { at: 0.15, pos: [-1, 1, -10], look: PLANET_POSITIONS.mars },
  { at: 0.25, pos: [0, 0, -25],  look: PLANET_POSITIONS.mars },
  { at: 0.30, pos: [1, 1, -40],  look: PLANET_POSITIONS.jupiter },
  { at: 0.45, pos: [0, 0, -60],  look: PLANET_POSITIONS.jupiter },
  { at: 0.50, pos: [-1, 0.5, -80], look: PLANET_POSITIONS.saturn },
  { at: 0.65, pos: [0, 1, -105], look: PLANET_POSITIONS.saturn },
  { at: 0.75, pos: [1, 0, -130], look: PLANET_POSITIONS.uranus },
  { at: 0.82, pos: [0, 0.5, -145], look: PLANET_POSITIONS.uranus },
  { at: 0.85, pos: [-0.5, 0, -165], look: PLANET_POSITIONS.neptune },
  { at: 1.00, pos: [0, 0, -185], look: PLANET_POSITIONS.neptune },
];

function lerpWaypoints(progress) {
  let i = 0;
  while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].at <= progress) {
    i++;
  }

  if (i >= WAYPOINTS.length - 1) {
    return { pos: WAYPOINTS[WAYPOINTS.length - 1].pos, look: WAYPOINTS[WAYPOINTS.length - 1].look };
  }

  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const t = (progress - a.at) / (b.at - a.at);
  const smooth = t * t * (3 - 2 * t);

  const pos = a.pos.map((v, idx) => v + (b.pos[idx] - v) * smooth);
  const look = a.look.map((v, idx) => v + (b.look[idx] - v) * smooth);

  return { pos, look };
}

export default function CameraRig({ scrollProgressRef }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const { pos, look } = lerpWaypoints(progress);

    camera.position.lerp(new THREE.Vector3(pos[0], pos[1], pos[2]), 0.08);

    lookAtTarget.current.lerp(new THREE.Vector3(look[0], look[1], look[2]), 0.08);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
