import React, { useEffect, useRef, useState, useCallback } from 'react';
import './game.css';


const Game = () => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef('start');
  const animationIdRef = useRef(null);
  
  // Game settings - EASIER VERSION
  const GRAVITY = 0.2;
  const FLAP_STRENGTH = -7;
  const GAME_SPEED = 2;
  const OBSTACLE_GAP = 170;
  
  // State
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start');
  const [showPowerup, setShowPowerup] = useState(false);
  const [powerupTime, setPowerupTime] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('oceanFlyerHighScore') || '0');
  });
  
  // Game objects refs
  const fishRef = useRef({
    x: 100,
    y: 500,
    width: 50,
    height: 35,
    velocity: 0,
    rotation: 0,
    hasInvincibility: false,
    invincibilityTime: 0,
    maxInvincibilityTime: 5000
  });
  
  const obstaclesRef = useRef([]);
  const powerupsRef = useRef([]);
  const bubblesRef = useRef([]);
  const particlesRef = useRef([]);
  
  // Timing
  const timingRef = useRef({
    lastObstacleTime: 0,
    obstacleInterval: 2500,
    lastPowerupTime: 0,
    powerupInterval: 12000
  });


  // Initialize bubbles
  const createBubbles = useCallback(() => {
    const bubbles = [];
    for (let i = 0; i < 20; i++) {
      bubbles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.3,
        wobble: Math.random() * 0.02 + 0.01
      });
    }
    bubblesRef.current = bubbles;
  }, []);


  // Fish flap function
  const flap = useCallback(() => {
    if (gameStateRef.current === 'playing') {
      fishRef.current.velocity = FLAP_STRENGTH;
      // Create particles for flap effect
      for (let i = 0; i < 4; i++) {
        particlesRef.current.push({
          x: fishRef.current.x - 10,
          y: fishRef.current.y + Math.random() * 20 - 10,
          vx: Math.random() * -2 - 1,
          vy: Math.random() * 4 - 2,
          life: 30,
          maxLife: 30,
          size: Math.random() * 3 + 2
        });
      }
    }
  }, []);


  // Create obstacle
  const createObstacle = useCallback((currentTime) => {
    const minHeight = 60;
    const maxHeight = 350;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    
    const isUpper = Math.random() > 0.5;
    
    if (isUpper) {
      const types = ['diver', 'hook', 'plastic'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      obstaclesRef.current.push({
        x: 800,
        y: 0,
        width: 60,
        height: height,
        type: type,
        upper: true,
        passed: false
      });
      
      obstaclesRef.current.push({
        x: 800,
        y: height + OBSTACLE_GAP,
        width: 60,
        height: 600 - (height + OBSTACLE_GAP),
        type: 'water',
        upper: false,
        passed: false
      });
    } else {
      const types = ['rock', 'shark'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      obstaclesRef.current.push({
        x: 800,
        y: 0,
        width: 60,
        height: height,
        type: 'water',
        upper: true,
        passed: false
      });
      
      obstaclesRef.current.push({
        x: 800,
        y: height + OBSTACLE_GAP,
        width: 60,
        height: 600 - (height + OBSTACLE_GAP),
        type: type,
        upper: false,
        passed: false
      });
    }
    
    timingRef.current.lastObstacleTime = currentTime;
  }, []);


  // Create powerup
  const createPowerup = useCallback((currentTime) => {
    if (Math.random() < 0.1) {
      powerupsRef.current.push({
        x: 800,
        y: Math.random() * 400 + 100,
        width: 30,
        height: 30,
        collected: false,
        pulse: 0,
        rotation: 0
      });
    }
    timingRef.current.lastPowerupTime = currentTime;
  }, []);


  // Collision detection
  const checkCollision = useCallback((rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);


  // Draw functions using CSS-style graphics
  const drawBackground = useCallback((ctx) => {
    // Ocean gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#87CEEB'); // Light blue surface
    gradient.addColorStop(0.15, '#5F9EA0'); // Cadet blue
    gradient.addColorStop(0.35, '#4682B4'); // Steel blue
    gradient.addColorStop(0.55, '#2E8B57'); // Sea green
    gradient.addColorStop(0.75, '#191970'); // Midnight blue
    gradient.addColorStop(0.9, '#1e3a5f'); // Dark blue
    gradient.addColorStop(1, '#654321'); // Brown seafloor
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Animated surface waves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const time = Date.now() * 0.002;
    for (let x = 0; x < 800; x += 20) {
      const wave1 = Math.sin((x * 0.02) + time) * 8;
      const wave2 = Math.sin((x * 0.05) + (time * 1.2)) * 4;
      const y = 70 + wave1 + wave2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Seafloor decorations
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 580, 800, 20);
    
    // Coral and seaweed
    ctx.fillStyle = '#FF7F50';
    for (let i = 0; i < 15; i++) {
      const x = (i * 60) + Math.sin(i) * 20;
      const y = 560 + Math.sin(i * 0.5) * 10;
      const height = 15 + Math.random() * 20;
      
      ctx.beginPath();
      ctx.moveTo(x, 600);
      ctx.quadraticCurveTo(x - 3, y + height/2, x, y);
      ctx.quadraticCurveTo(x + 5, y + height/3, x + 8, 600);
      ctx.fill();
    }
  }, []);


  const drawBubbles = useCallback((ctx) => {
    const time = Date.now() * 0.001;
    
    bubblesRef.current.forEach(bubble => {
      const wobbleX = Math.sin(time + bubble.y * 0.01) * bubble.wobble * 15;
      
      // Bubble with gradient
      const gradient = ctx.createRadialGradient(
        bubble.x + wobbleX, bubble.y, 0,
        bubble.x + wobbleX, bubble.y, bubble.size
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.8})`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${bubble.opacity * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x + wobbleX, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.6})`;
      ctx.beginPath();
      ctx.arc(bubble.x + wobbleX - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);


  const drawFish = useCallback((ctx) => {
    const fish = fishRef.current;
    
    ctx.save();
    ctx.translate(fish.x + fish.width/2, fish.y + fish.height/2);
    ctx.rotate(fish.rotation);
    
    // Glow effect during invincibility
    if (fish.hasInvincibility) {
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20;
      
      const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
      ctx.globalAlpha = pulse;
    }
    
    // Fish body gradient
    const bodyGradient = ctx.createLinearGradient(-fish.width/2, -fish.height/2, fish.width/2, fish.height/2);
    if (fish.hasInvincibility) {
      bodyGradient.addColorStop(0, '#FFD700');
      bodyGradient.addColorStop(0.5, '#FFA500');
      bodyGradient.addColorStop(1, '#FF8C00');
    } else {
      bodyGradient.addColorStop(0, '#4169E1');
      bodyGradient.addColorStop(0.5, '#1E90FF');
      bodyGradient.addColorStop(1, '#0066CC');
    }
    
    // Fish body
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, fish.width/2, fish.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pectoral fins (wings)
    const finColor = fish.hasInvincibility ? '#FFA500' : '#6495ED';
    ctx.fillStyle = finColor;
    
    ctx.beginPath();
    ctx.ellipse(-fish.width/4, -fish.height/3, fish.width/3, fish.height/5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(-fish.width/4, fish.height/3, fish.width/3, fish.height/5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail
    ctx.fillStyle = fish.hasInvincibility ? '#FF8C00' : '#4682B4';
    ctx.beginPath();
    ctx.moveTo(-fish.width/2, 0);
    ctx.lineTo(-fish.width * 0.9, -fish.height/4);
    ctx.lineTo(-fish.width * 0.7, 0);
    ctx.lineTo(-fish.width * 0.9, fish.height/4);
    ctx.closePath();
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(fish.width/4, -fish.height/6, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(fish.width/4, -fish.height/6, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, []);


  const drawObstacles = useCallback((ctx) => {
    obstaclesRef.current.forEach(obstacle => {
      if (obstacle.type === 'water') return;
      
      ctx.save();
      
      switch (obstacle.type) {
        case 'diver':
          // Diver body
          const diverGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          diverGradient.addColorStop(0, '#FF4500');
          diverGradient.addColorStop(0.5, '#FF6347');
          diverGradient.addColorStop(1, '#DC143C');
          ctx.fillStyle = diverGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // Diving mask
          ctx.fillStyle = '#000000';
          ctx.fillRect(obstacle.x + 12, obstacle.y + 12, 30, 18);
          ctx.fillStyle = '#4169E1';
          ctx.fillRect(obstacle.x + 15, obstacle.y + 15, 24, 12);
          
          // Air bubbles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          for (let i = 0; i < 3; i++) {
            const bubbleX = obstacle.x + 25 + Math.sin(Date.now() * 0.005 + i) * 8;
            const bubbleY = obstacle.y + 8 + i * 12;
            ctx.beginPath();
            ctx.arc(bubbleX, bubbleY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
          
        case 'hook':
          // Fishing line
          ctx.strokeStyle = '#C0C0C0';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(obstacle.x + 30, obstacle.y);
          ctx.lineTo(obstacle.x + 30, obstacle.y + obstacle.height - 20);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Hook
          ctx.strokeStyle = '#A0A0A0';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(obstacle.x + 30, obstacle.y + obstacle.height - 20);
          ctx.lineTo(obstacle.x + 30, obstacle.y + obstacle.height - 5);
          ctx.arc(obstacle.x + 20, obstacle.y + obstacle.height - 5, 10, 0, Math.PI, true);
          ctx.lineTo(obstacle.x + 10, obstacle.y + obstacle.height - 8);
          ctx.stroke();
          break;
          
        case 'plastic':
          // Plastic bag
          ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.9)';
          ctx.lineWidth = 1;
          
          ctx.beginPath();
          ctx.moveTo(obstacle.x, obstacle.y + 8);
          ctx.quadraticCurveTo(obstacle.x + obstacle.width/4, obstacle.y, obstacle.x + obstacle.width/2, obstacle.y + 4);
          ctx.quadraticCurveTo(obstacle.x + 3*obstacle.width/4, obstacle.y, obstacle.x + obstacle.width, obstacle.y + 8);
          ctx.lineTo(obstacle.x + obstacle.width - 4, obstacle.y + obstacle.height - 8);
          ctx.quadraticCurveTo(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height, obstacle.x + 4, obstacle.y + obstacle.height - 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
          
        case 'rock':
          // Rock with texture
          const rockGradient = ctx.createRadialGradient(
            obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 0,
            obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2
          );
          rockGradient.addColorStop(0, '#A9A9A9');
          rockGradient.addColorStop(0.5, '#696969');
          rockGradient.addColorStop(1, '#2F4F4F');
          
          ctx.fillStyle = rockGradient;
          ctx.beginPath();
          ctx.moveTo(obstacle.x + 8, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width - 12, obstacle.y + 4);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + 18);
          ctx.lineTo(obstacle.x + obstacle.width - 6, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x + 10, obstacle.y + obstacle.height - 4);
          ctx.lineTo(obstacle.x, obstacle.y + 22);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'shark':
          // Shark body
          const sharkGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          sharkGradient.addColorStop(0, '#708090');
          sharkGradient.addColorStop(0.5, '#2F4F4F');
          sharkGradient.addColorStop(1, '#191970');
          
          ctx.fillStyle = sharkGradient;
          ctx.beginPath();
          ctx.ellipse(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, obstacle.height/3, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Shark fin
          ctx.beginPath();
          ctx.moveTo(obstacle.x + 8, obstacle.y + 4);
          ctx.lineTo(obstacle.x + 20, obstacle.y);
          ctx.lineTo(obstacle.x + 28, obstacle.y + 12);
          ctx.lineTo(obstacle.x + 16, obstacle.y + 20);
          ctx.closePath();
          ctx.fill();
          
          // Teeth
          ctx.fillStyle = '#FFFFFF';
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x + 12 + i * 6, obstacle.y + obstacle.height/2);
            ctx.lineTo(obstacle.x + 13 + i * 6, obstacle.y + obstacle.height/2 + 4);
            ctx.lineTo(obstacle.x + 15 + i * 6, obstacle.y + obstacle.height/2);
            ctx.closePath();
            ctx.fill();
          }
          break;
      }
      
      ctx.restore();
    });
  }, []);


  const drawPowerups = useCallback((ctx) => {
    const time = Date.now() * 0.005;
    
    powerupsRef.current.forEach(powerup => {
      if (!powerup.collected) {
        powerup.pulse += 0.1;
        powerup.rotation += 0.05;
        
        ctx.save();
        ctx.translate(powerup.x + powerup.width/2, powerup.y + powerup.height/2);
        
        // Outer glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        
        // Rotating ring
        ctx.rotate(time);
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, powerup.width/2 + 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.rotate(-time);
        
        // Main orb
        const pulseSize = powerup.width/2 + Math.sin(powerup.pulse) * 2;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
        gradient.addColorStop(0, '#FFFF99');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkles
        ctx.rotate(powerup.rotation);
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI / 2));
          ctx.translate(18, 0);
          ctx.beginPath();
          ctx.moveTo(0, -1);
          ctx.lineTo(2, 0);
          ctx.lineTo(0, 1);
          ctx.lineTo(-2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        
        ctx.restore();
        ctx.shadowBlur = 0;
      }
    });
  }, []);


  const drawParticles = useCallback((ctx) => {
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, 'rgba(135, 206, 235, 1)');
      gradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    });
  }, []);


  // Update game objects
  const updateGame = useCallback((currentTime) => {
    if (gameStateRef.current !== 'playing') return;
    
    const fish = fishRef.current;
    
    // Update fish physics
    fish.velocity += GRAVITY;
    fish.y += fish.velocity;
    fish.rotation = Math.min(Math.max(fish.velocity * 0.06, -0.4), 0.4);
    
    // Update invincibility
    if (fish.hasInvincibility) {
      fish.invincibilityTime -= 16;
      if (fish.invincibilityTime <= 0) {
        fish.hasInvincibility = false;
        setShowPowerup(false);
      } else {
        setPowerupTime(Math.max(0, Math.ceil(fish.invincibilityTime / 1000)));
      }
    }
    
    // Boundary collision
    if (fish.y < 0 || fish.y + fish.height > 600) {
      if (!fish.hasInvincibility) {
        setGameState('gameOver');
        gameStateRef.current = 'gameOver';
        return;
      }
    }
    
    // Update bubbles
    bubblesRef.current.forEach(bubble => {
      bubble.y -= bubble.speed;
      bubble.x += Math.sin(Date.now() * 0.001 + bubble.y * 0.01) * bubble.wobble;
      
      if (bubble.y < -10) {
        bubble.y = 610;
        bubble.x = Math.random() * 800;
      }
    });
    
    // Update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      particle.vy += 0.05;
      return particle.life > 0;
    });
    
    // Create obstacles
    if (currentTime - timingRef.current.lastObstacleTime > timingRef.current.obstacleInterval) {
      createObstacle(currentTime);
    }
    
    // Create powerups
    if (currentTime - timingRef.current.lastPowerupTime > timingRef.current.powerupInterval) {
      createPowerup(currentTime);
    }
    
    // Update obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= GAME_SPEED;
      
      // Check scoring
      if (!obstacle.passed && obstacle.x + obstacle.width < fish.x) {
        obstacle.passed = true;
        if (obstacle.type !== 'water') {
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('oceanFlyerHighScore', newScore.toString());
            }
            return newScore;
          });
        }
      }
      
      // Check collision
      if (!fish.hasInvincibility && obstacle.type !== 'water' && 
          checkCollision(fish, obstacle)) {
        setGameState('gameOver');
        gameStateRef.current = 'gameOver';
        return false;
      }
      
      return obstacle.x > -obstacle.width;
    });
    
    // Update powerups
    powerupsRef.current = powerupsRef.current.filter(powerup => {
      powerup.x -= GAME_SPEED;
      
      // Check collection
      if (!powerup.collected && checkCollision(fish, powerup)) {
        powerup.collected = true;
        fish.hasInvincibility = true;
        fish.invincibilityTime = fish.maxInvincibilityTime;
        setShowPowerup(true);
        setPowerupTime(5);
        
        // Create collection particles
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            x: powerup.x + powerup.width/2,
            y: powerup.y + powerup.height/2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 50,
            maxLife: 50,
            size: 3
          });
        }
        
        return false;
      }
      
      return powerup.x > -powerup.width && !powerup.collected;
    });
  }, [checkCollision, createObstacle, createPowerup, highScore]);


  // Main game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const currentTime = Date.now();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBackground(ctx);
    drawBubbles(ctx);
    drawObstacles(ctx);
    drawPowerups(ctx);
    drawFish(ctx);
    drawParticles(ctx);
    
    // Update game state
    updateGame(currentTime);
    
    // Continue game loop
    animationIdRef.current = requestAnimationFrame(gameLoop);
  }, [drawBackground, drawBubbles, drawObstacles, drawPowerups, drawFish, drawParticles, updateGame]);


  // Game control functions
  const startGame = useCallback(() => {
    setGameState('playing');
    gameStateRef.current = 'playing';
    setScore(0);
    
    // Reset fish
    fishRef.current = {
      x: 100,
      y: 300,
      width: 50,
      height: 35,
      velocity: 0,
      rotation: 0,
      hasInvincibility: false,
      invincibilityTime: 0,
      maxInvincibilityTime: 5000
    };
    
    // Clear game objects
    obstaclesRef.current = [];
    powerupsRef.current = [];
    particlesRef.current = [];
    
    // Reset timing
    timingRef.current = {
      lastObstacleTime: Date.now(),
      obstacleInterval: 2500,
      lastPowerupTime: Date.now(),
      powerupInterval: 12000
    };
  }, []);


  const resetGame = useCallback(() => {
    setGameState('start');
    gameStateRef.current = 'start';
    setShowPowerup(false);
    setPowerupTime(0);
  }, []);


  // Event listeners
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    };
    
    const handleClick = () => {
      flap();
    };
    
    document.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [flap]);


  // Initialize game
  useEffect(() => {
    createBubbles();
    gameLoop();
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [createBubbles, gameLoop]);


  return (
    <div className="game-container">
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="game-canvas"
      />
      
      <div className="ui-overlay">
        <div className="score-display">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
        </div>
        
        <div className="high-score-display">
          <span className="high-score-label">Best:</span>
          <span className="high-score-value">{highScore}</span>
        </div>
        
        {showPowerup && (
          <div className="powerup-indicator">
            <div className="powerup-timer">
              <div 
                className="powerup-progress"
                style={{
                  width: `${(powerupTime / 5) * 100}%`
                }}
              />
            </div>
            <span>INVINCIBLE! {powerupTime}s</span>
          </div>
        )}
      </div>
      
      {gameState === 'start' && (
        <div className="start-screen">
          <div className="start-content">
            <h1>🐟 Ocean Flyer</h1>
            <p>Navigate the Exocoetidae flying fish through underwater obstacles!</p>
            <div className="controls-info">
              <p><strong>🖱️ Controls:</strong> Click or press SPACEBAR to flap</p>
              <p><strong>✨ Golden Orb:</strong> 5 seconds of invincibility</p>
              <p><strong>🎯 Goal:</strong> Avoid obstacles and beat your high score!</p>
              <p><strong>🎮 Difficulty:</strong> Easy mode with slower physics</p>
            </div>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={startGame}
            >
              🌊 Start Swimming
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>🎯 Game Over!</h2>
            <p className="final-score">Final Score: {score}</p>
            <p className="high-score-info">High Score: {highScore}</p>
            <p className="encouragement">
              {score < 5 ? "🌊 Keep swimming! Practice makes perfect!" :
               score < 15 ? "🐠 Great swimming! You're getting better!" :
               score < 25 ? "🏆 Excellent navigation skills!" :
               "🌟 Master of the ocean! Amazing performance!"}
            </p>
            <button 
              className="btn btn-primary btn-lg" 
              onClick={resetGame}
            >
              🔄 Swim Again
            </button>
          </div>
        </div>
      )}
      
      <div className="instructions">
        <p>🌊 Guide the flying fish through ocean depths • Easy mode: slower fall • Collect golden orbs for power! 🌊</p>
      </div>
    </div>
  );
};


export default Game;