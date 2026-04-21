import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_POSITIONS } from './constants';

/**
 * CameraRig — scroll-driven camera with smooth continuous travel through the solar system.
 *
 * The camera continuously glides from planet to planet using smootherstep interpolation
 * between waypoints. Saturn has a special orbit zone where dragging revolves the camera
 * around the planet instead of following the linear scroll path.
 */

const P = PLANET_POSITIONS;

// Camera offsets from each planet
const CAM = {
  earth:   [P.earth[0] + 0,    P.earth[1] + 0.5,   P.earth[2] + 5],
  mars:    [P.mars[0] + 1.5,   P.mars[1] + 0.5,    P.mars[2] + 4],
  jupiter: [P.jupiter[0] - 1,  P.jupiter[1] + 1,   P.jupiter[2] + 6],
  saturn:  [P.saturn[0] + 0,   P.saturn[1] + 2,    P.saturn[2] + 7],
  uranus:  [P.uranus[0] + 1.5, P.uranus[1] + 0.5,  P.uranus[2] + 4],
  neptune: [P.neptune[0] - 1,  P.neptune[1] + 0.5, P.neptune[2] + 4],
};

const WAYPOINTS = [
  { at: 0.00, pos: CAM.earth,   look: P.earth },
  { at: 0.13, pos: CAM.mars,    look: P.mars },
  { at: 0.26, pos: CAM.jupiter, look: P.jupiter },
  { at: 0.48, pos: CAM.saturn,  look: P.saturn },
  { at: 0.72, pos: CAM.uranus,  look: P.uranus },
  { at: 0.88, pos: CAM.neptune, look: P.neptune },
];

// Saturn orbit config
const ORBIT_RADIUS = 8;
const ORBIT_Y_OFFSET = 2;
const SATURN_ZONE_START = 0.38;
const SATURN_ZONE_END = 0.60;

function smootherstep(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerpWaypoints(progress) {
  let i = 0;
  while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].at <= progress) i++;

  if (i >= WAYPOINTS.length - 1) {
    const last = WAYPOINTS[WAYPOINTS.length - 1];
    return { pos: [...last.pos], look: [...last.look] };
  }

  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const range = b.at - a.at;
  const t = range > 0 ? smootherstep((progress - a.at) / range) : 0;

  const pos = a.pos.map((v, idx) => v + (b.pos[idx] - v) * t);
  const look = a.look.map((v, idx) => v + (b.look[idx] - v) * t);

  return { pos, look };
}

export default function CameraRig({ scrollProgressRef, orbitAngleRef, isOrbiting }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3());
  const smoothAngle = useRef(0);

  useFrame(() => {
    const progress = scrollProgressRef.current;
    const inSaturnZone = progress >= SATURN_ZONE_START && progress <= SATURN_ZONE_END;

    if (inSaturnZone && isOrbiting && orbitAngleRef) {
      const targetAngle = orbitAngleRef.current;
      smoothAngle.current += (targetAngle - smoothAngle.current) * 0.06;

      const saturn = P.saturn;
      const angle = smoothAngle.current;
      const orbitX = saturn[0] + Math.sin(angle) * ORBIT_RADIUS;
      const orbitZ = saturn[2] + Math.cos(angle) * ORBIT_RADIUS;
      const orbitY = saturn[1] + ORBIT_Y_OFFSET;

      camera.position.lerp(new THREE.Vector3(orbitX, orbitY, orbitZ), 0.05);
      lookAtTarget.current.lerp(new THREE.Vector3(saturn[0], saturn[1], saturn[2]), 0.08);
    } else {
      const { pos, look } = lerpWaypoints(progress);
      camera.position.lerp(new THREE.Vector3(pos[0], pos[1], pos[2]), 0.06);
      lookAtTarget.current.lerp(new THREE.Vector3(look[0], look[1], look[2]), 0.06);
    }

    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
