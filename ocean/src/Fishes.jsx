import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import fish from './assets/fish.webp'
import octo from './assets/octopus.webp'
import jell from './assets/jelllyfish.webp'
import shark from './assets/shark.webp'
import whale from './assets/whale1.webp'

const FishesRiseAnimation = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-50vh) translateX(10px) scale(0.6);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) translateX(-10px) scale(0.5);
    opacity: 0;
  }
`;

const SlideInFromLeftAnimation = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styled Components
const FishesOcean = styled.div`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #002f4b 0%, #001119 100%);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FishesRippleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const FishesBubbles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
`;

const FishesBubble = styled.div`
  position: absolute;
  bottom: -50px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: ${FishesRiseAnimation} linear infinite;
`;

const FishesTaskbar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;
  background: rgba(0, 0, 30, 0.7);
  padding: 15px;
  color: white;
  z-index: 3;
  overflow: hidden;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
`;

const FishesTaskbarContent = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const TaskbarTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #87CEEB;
  font-size: 1.5rem;
`;

const FishesAnimalCard = styled.div`
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 5px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    font-size: 0.9rem;
    font-weight: bold;
    color: #E0FFFF;
    margin-bottom: 8px;
  }

  &.reloading img {
    animation: ${SlideInFromLeftAnimation} 0.5s ease-out forwards;
  }
`;

const FishesButtons = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AnimalCardButton = styled.button`
  padding: 8px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #007bff;
  color: white;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

const FishesSwimAnimal = styled.img`
  position: absolute;
  width: 50px;
  height: auto;
  z-index: 2;
`;

const FishesInfoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const FishesInfoModalContent = styled.div`
  background: #001f3f;
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.2);

  p {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s ease;

    &:hover {
      background: #0056b3;
    }
  }
`;

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
    
      const taskbar = document.querySelector('[data-testid="fishes-taskbar"]');
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

  const animalCardRefs = useRef({});

  const releaseAnimal = (animal) => {
    
    const cardElement = animalCardRefs.current[animal.id];
    const imgElement = cardElement?.querySelector('img');

    if (!imgElement) {
      console.error('Could not find image element for', animal.name);
      return;
    }

    const imgRect = imgElement.getBoundingClientRect();
    const startX = imgRect.left + 150;
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
    <FishesOcean>
      <FishesRippleCanvas ref={canvasRef} />

      <FishesTaskbar data-testid="fishes-taskbar">
        <FishesTaskbarContent>
          <TaskbarTitle>Aquatic Animals</TaskbarTitle>
          {animals.map((animal) => (
            <FishesAnimalCard
              key={animal.id}
              ref={el => animalCardRefs.current[animal.id] = el}
              className={reloadingAnimalId === animal.id ? 'reloading' : ''}
              onClick={(e) => handleAnimalCardClick(e, animal)}
            >
              <img src={animal.img} alt={animal.name} />
              <p>{animal.name}</p>
              {selected === animal.id && (
                <FishesButtons>
                  <AnimalCardButton onClick={() => setInfoMessage(`${animal.name} info coming soon!`)}>
                    Information
                  </AnimalCardButton>
                  <AnimalCardButton onClick={(e) => { 
                    e.stopPropagation(); 
                    releaseAnimal(animal);
                  }}>
                    Release into Sea
                  </AnimalCardButton>
                </FishesButtons>
              )}
            </FishesAnimalCard>
          ))}
        </FishesTaskbarContent>
      </FishesTaskbar>

      <FishesBubbles>
        {[...Array(25)].map((_, i) => (
          <FishesBubble key={i} style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </FishesBubbles>

      {releasedAnimals.map((a, i) => (
        <FishesSwimAnimal
          key={i}
          src={a.img}
          alt={a.name}
          style={{ left: a.x, top: a.y }}
        />
      ))}

      {infoMessage && (
        <FishesInfoModal>
          <FishesInfoModalContent>
            <p>{infoMessage}</p>
            <button onClick={() => setInfoMessage(null)}>Close</button>
          </FishesInfoModalContent>
        </FishesInfoModal>
      )}
    </FishesOcean>
  );
};

export default Fishes;