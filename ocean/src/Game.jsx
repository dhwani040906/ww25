import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Stars, Box } from '@react-three/drei';
import { create } from 'zustand';
//
// Store: manages fish, obstacles, game state
//
const useStore = create((set) => ({
  fishPos: [0, 0, 0],
  obstacles: [],
  gameOver: false,
  gravity: -4,
  jumpStrength: 2.5,
  restart: () =>
    set({
      fishPos: [0, 0, 0],
      obstacles: [],
      gameOver: false,
    }),
  updateFish: (pos) => set({ fishPos: pos }),
  addObstacle: (obs) => set((state) => ({ obstacles: [...state.obstacles, obs] })),
  removeObstacle: (id) =>
    set((state) => ({ obstacles: state.obstacles.filter((o) => o.id !== id) })),
  endGame: () => set({ gameOver: true }),
}));

//
// Main Game Component
//
function GameScene() {
  const fishRef = useRef();
  const {
    fishPos,
    obstacles,
    gameOver,
    gravity,
    jumpStrength,
    updateFish,
    addObstacle,
    removeObstacle,
    endGame,
  } = useStore();

  // Gravity & movement
  useFrame((_, delta) => {
    if (gameOver) return;
    let [x, y, z] = fishPos;
    y += gravity * delta;
    updateFish([x, y, z]);

    if (fishRef.current) {
      fishRef.current.position.set(x, y, z);
      fishRef.current.rotation.z = -y / 5;
    }
    if (y < -5 || y > 5) endGame();
  });

  // Spawn obstacles
  useEffect(() => {
    let idCounter = 0;
    const interval = setInterval(() => {
      const id = idCounter++;
      const gapY = Math.random() * 6 - 3;
      addObstacle({ id, x: 12, gapY });
    }, 1500);
    return () => clearInterval(interval);
  }, [addObstacle]);

  // Move obstacles & detect collisions
  useFrame((_, delta) => {
    if (gameOver) return;
    obstacles.forEach((obs) => {
      obs.x -= delta * 4;
      if (obs.x < -12) removeObstacle(obs.id);

      // 2D collision on y-axis + x proximity
      const [fx, fy] = fishPos;
      if (
        fx > obs.x - 0.5 && fx < obs.x + 0.5 &&
        (fy < obs.gapY - 1.2 || fy > obs.gapY + 1.2)
      ) {
        endGame();
      }
    });
  });

  // Controls
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === 'Space' && !gameOver) {
        const [x, y, z] = fishPos;
        updateFish([x, y + jumpStrength, z]);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fishPos, updateFish, jumpStrength, gameOver]);

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />

      {/* Sea plants */}
      <mesh position={[-3, -4, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial color="#228B22" side={2} />
      </mesh>
      <mesh position={[3, -4, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial color="#32CD32" side={2} />
      </mesh>

      {/* Fish */}
      <mesh ref={fishRef} position={fishPos}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>

      {/* Obstacles */}
      {obstacles.map((obs) => (
        <group key={obs.id}>
          {/* Top: boat */}
          <Box args={[2, 1, 1]} position={[obs.x, obs.gapY + 3, 0]}>
            <meshStandardMaterial color="saddlebrown" />
          </Box>
          {/* Bottom: rock */}
          <Box args={[2, 1, 1]} position={[obs.x, obs.gapY - 3, 0]}>
            <meshStandardMaterial color="gray" />
          </Box>
        </group>
      ))}
    </>
  );
}

function Game() {
  const { gameOver, restart } = useStore();
  return (
    <>
      {gameOver && (
        <div className="overlay">
          <h1>Game Over</h1>
          <button onClick={restart}>Restart</button>
        </div>
      )}
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <GameScene />
      </Canvas>
    </>
  );
}

// Render
const container = document.getElementById('root');
createRoot(container).render(<Game />);
export default Game;