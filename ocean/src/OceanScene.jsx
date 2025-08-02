import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LightRays() {
  return (
    <spotLight
      position={[0, 10, 0]}
      angle={1}
      penumbra={1}
      intensity={0.6}
      color="#88cfff"
      castShadow
    />
  );
}

function OceanBackground() {
  const mesh = useRef();
  const material = new THREE.MeshStandardMaterial({
    color: '#001f3f',
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });

  useFrame(({ clock }) => {
    mesh.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.1;
    mesh.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.5;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial {...material} />
    </mesh>
  );
}

function Bubbles() {
  const group = useRef();
  useFrame(({ clock }) => {
    group.current.children.forEach((bubble, i) => {
      bubble.position.y += 0.01;
      if (bubble.position.y > 10) bubble.position.y = -5;
    });
  });

  const bubbles = new Array(100).fill().map((_, i) => (
    <mesh key={i} position={[Math.random() * 20 - 10, Math.random() * 5 - 5, Math.random() * 20 - 10]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#aadfff" transparent opacity={0.4} />
    </mesh>
  ));

  return <group ref={group}>{bubbles}</group>;
}

function FloatingFish() {
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1}>
      <mesh position={[2, 0, -5]}>
        <boxGeometry args={[1, 0.5, 0.3]} />
        <meshStandardMaterial color="#00eaff" />
      </mesh>
    </Float>
  );
}

export default function OceanScene() {
  return (
    <div style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 70 }}>
        <color attach="background" args={['#000c1f']} />
        <fog attach="fog" args={['#000c1f', 10, 30]} />
        <ambientLight intensity={0.3} />
        <LightRays />
        <OceanBackground />
        <Bubbles />
        <FloatingFish />
        <Stars radius={50} depth={50} count={500} factor={4} fade />
        {/* <OrbitControls /> // Optional for testing */}
      </Canvas>
    </div>
  );
}