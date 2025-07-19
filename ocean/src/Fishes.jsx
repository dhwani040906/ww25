import React, { useEffect, useRef, useState } from 'react';
import fish from './assets/fish.webp'
import octo from './assets/octopus.webp'
import jell from './assets/jelllyfish.webp'
import shark from './assets/shark.webp'
import whale from './assets/whale1.webp'
import './Fishes.css';

const animals = [
  { id: '1', name: 'Clownfish', img: fish },
  { id: '2', name: 'Whale', img: whale },
  { id: '3', name: 'Shark', img: shark },
  { id: '4', name: 'Jellyfish', img: jell },
  { id: '5', name: 'Octopus', img: octo },
];

const Fishes = () => {
  const canvasRef = useRef(null);
  const [releasedAnimals, setReleasedAnimals] = useState([]);
  const [selected, setSelected] = useState(null);
  const ripples = useRef([]);
  const animalEffects = useRef([]);
  const [reloadingAnimalId, setReloadingAnimalId] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    const createMouseRipple = (x, y, dx, dy) => {
      ripples.current.push({ x, y, radius: 0, dx, dy, opacity: 1 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples.current = ripples.current.filter((ripple) => {
        ripple.radius += 2;
        ripple.x += ripple.dx * 0.2;
        ripple.y += ripple.dy * 0.2;
        ripple.opacity -= 0.01;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return ripple.opacity > 0;
      });

      animalEffects.current = animalEffects.current.filter((effect) => {
        if (effect.type === 'bubble') {
          effect.radius += 0.6;
          effect.y -= 8;
          effect.opacity -= 0.07;
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${effect.opacity})`;
          ctx.fill();
          return effect.opacity > 0 && effect.radius < 10;
        }
      });
      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      const taskbar = document.querySelector('.taskbar');
      if (taskbar) {
        const rect = taskbar.getBoundingClientRect();
        if (e.clientX > rect.right) {
          createMouseRipple(e.clientX, e.clientY, e.movementX, e.movementY);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    draw();
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReleasedAnimals((prev) =>
        prev.map((a) => {
          const elapsed = Date.now() - a.releaseTime;
          let currentDx = a.dx;
          let currentDy = a.dy;
          if (elapsed < a.initialMovementDuration) {
            currentDx = a.initialDx;
            currentDy = a.initialDy;
          } else if (!a.hasRandomized) {
            currentDx = Math.random() * 4 - 2;
            currentDy = Math.random() * 4 - 2;
            a.hasRandomized = true;
          }
          let nextX = a.x + currentDx;
          let nextY = a.y + currentDy;
          let updatedDx = currentDx;
          let updatedDy = currentDy;
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const hitLeft = nextX < 0;
          const hitRight = nextX + a.width > screenWidth;
          const hitTop = nextY < 0;
          const hitBottom = nextY + a.height > screenHeight;
          if ((hitLeft && hitTop) || (hitLeft && hitBottom) || (hitRight && hitTop) || (hitRight && hitBottom)) {
            updatedDx = -currentDx;
            updatedDy = -currentDy;
            if (hitLeft) nextX = 0;
            if (hitRight) nextX = screenWidth - a.width;
            if (hitTop) nextY = 0;
            if (hitBottom) nextY = screenHeight - a.height;
          } else {
            if (nextX < 0) {
              nextX = 0;
              updatedDx = Math.abs(currentDx);
            } else if (nextX + a.width > screenWidth) {
              nextX = screenWidth - a.width;
              updatedDx = -Math.abs(currentDx);
            }

            // Regular wall bounce (Y-axis)
            if (nextY < 0) {
              nextY = 0;
              updatedDy = Math.abs(currentDy);
            } else if (nextY + a.height > screenHeight) {
              nextY = screenHeight - a.height;
              updatedDy = -Math.abs(currentDy);
            }
          }

          a.dx = updatedDx;
          a.dy = updatedDy;

          // Emit bubbles
          if (Math.random() < 0.05) {
            animalEffects.current.push({
              type: 'bubble',
              x: a.x + a.width,
              y: a.y + a.height / 2 + (Math.random() * 10 - 5),
              radius: 4,
              opacity: 0.6,
            });
          }

      
          return {
            ...a,
            dx: updatedDx,
            dy: updatedDy,
            x: nextX,
            y: nextY,
          };
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const releaseAnimal = (animal, imgElement) => {
    const imgRect = imgElement.getBoundingClientRect();
    const startX = imgRect.left+150;
    const startY = imgRect.top;

    const initialDx = Math.random() * 15 + 5;
    const initialDy = Math.random() * 2 - 1;

    setReleasedAnimals((prev) => [
      ...prev,
      {
        ...animal,
        x: startX,
        y: startY,
        dx: initialDx,
        dy: initialDy,
        initialDx: initialDx,
        initialDy: initialDy,
        releaseTime: Date.now(),
        initialMovementDuration: 2000,
        hasRandomized: false,
        width: imgRect.width,
        height: imgRect.height
      },
    ]);
    setSelected(null);

    setReloadingAnimalId(animal.id);
    setTimeout(() => {
      setReloadingAnimalId(null);
    }, 500);
  };

  const handleAnimalCardClick = (e, animal) => {
    setSelected(selected === animal.id ? null : animal.id);
  };

  return (
    <div className="ocean">
      <canvas ref={canvasRef} className="rippleCanvas" />

      <div className="taskbar">
        <h2>Aquatic Animals</h2>
        {animals.map((animal) => (
          <div
            key={animal.id}
            className={`animalCard ${reloadingAnimalId === animal.id ? 'reloading' : ''}`}
            onClick={(e) => handleAnimalCardClick(e, animal)}
          >
            <img src={animal.img} alt={animal.name} />
            <p>{animal.name}</p>
            {selected === animal.id && (
              <div className="buttons">
                <button onClick={() => setInfoMessage(`${animal.name} info coming soon!`)}>Information</button>
                <button onClick={(e) => { e.stopPropagation(); releaseAnimal(animal, e.currentTarget.closest('.animalCard').querySelector('img')); }}>Release into Sea</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bubbles">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {releasedAnimals.map((a, i) => (
        <img
          key={i}
          src={a.img}
          alt={a.name}
          className="swimAnimal"
          style={{ left: a.x, top: a.y }}
        />
      ))}

      {infoMessage && (
        <div className="info-modal">
          <div className="info-modal-content">
            <p>{infoMessage}</p>
            <button onClick={() => setInfoMessage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fishes;
