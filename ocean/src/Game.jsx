import React, { useState, useEffect, useRef, useCallback } from 'react';
import './game.css';

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [fishPosition, setFishPosition] = useState(250);
  const [fishRotation, setFishRotation] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [flyPowerupActive, setFlyPowerupActive] = useState(false);
  const [flyPowerupVisible, setFlyPowerupVisible] = useState(false);
  const [flyPowerupPosition, setFlyPowerupPosition] = useState({ x: 0, y: 0 });
  const [obstacles, setObstacles] = useState([]);
  
  const gameAreaRef = useRef(null);
  const gravity = useRef(0.5);
  const jumpForce = useRef(-10);
  const gameSpeed = useRef(5);
  const gameLoopRef = useRef(null);
  const obstacleTimerRef = useRef(null);
  const powerupTimerRef = useRef(null);
  const fishVelocity = useRef(0);

  // Generate random obstacles
  const generateObstacle = useCallback(() => {
    if (!gameStarted || gameOver) return;

    const isUpperObstacle = Math.random() > 0.5;
    const obstacleTypes = isUpperObstacle 
      ? ['diver', 'hook', 'plastic'] 
      : ['rock', 'shark'];
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    const gap = 150; // Gap for fish to pass through
    const obstacleHeight = Math.floor(Math.random() * 200) + 100;
    
    const newObstacle = {
      id: Date.now(),
      x: gameAreaRef.current.offsetWidth,
      type,
      isUpperObstacle,
      height: obstacleHeight,
      passed: false
    };
    
    setObstacles(prev => [...prev, newObstacle]);
  }, [gameStarted, gameOver]);

  // Generate powerup
  const generatePowerup = useCallback(() => {
    if (!gameStarted || gameOver || flyPowerupVisible) return;
    
    setFlyPowerupPosition({
      x: gameAreaRef.current.offsetWidth + 300,
      y: Math.floor(Math.random() * (gameAreaRef.current.offsetHeight - 100)) + 50
    });
    setFlyPowerupVisible(true);
  }, [gameStarted, gameOver, flyPowerupVisible]);

  // Handle jump/flap
  const handleJump = useCallback(() => {
    if (gameOver) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setObstacles([]);
      setFishPosition(250);
      fishVelocity.current = 0;
    }
    
    fishVelocity.current = jumpForce.current;
    setFishRotation(-30);
  }, [gameOver, gameStarted]);

  // Activate flying powerup
  const activateFlying = useCallback(() => {
    setIsFlying(true);
    setFlyPowerupActive(true);
    setFlyPowerupVisible(false);
    fishVelocity.current = -5;
    
    setTimeout(() => {
      setIsFlying(false);
      setFlyPowerupActive(false);
    }, 5000);
  }, []);

  // Main game loop
  useEffect(() => {
    if (!gameStarted) return;

    const updateGameState = () => {
      // Update fish position
      if (!isFlying) {
        fishVelocity.current += gravity.current;
        setFishPosition(prev => {
          const newPosition = prev + fishVelocity.current;
          return Math.max(0, Math.min(newPosition, gameAreaRef.current.offsetHeight - 40));
        });
      } else {
        // Flying mode - move upward gently
        setFishPosition(prev => Math.max(0, prev - 3));
      }

      // Rotate fish based on velocity
      setFishRotation(Math.min(90, Math.max(-30, fishVelocity.current * 3)));

      // Move obstacles
      setObstacles(prev => {
        return prev.map(obstacle => {
          // Check for collision
          if (!flyPowerupActive && !gameOver) {
            const fishRight = 100;
            const fishBottom = fishPosition + 40;
            const fishTop = fishPosition;
            
            const obstacleLeft = obstacle.x;
            const obstacleRight = obstacle.x + 60;
            const obstacleTop = obstacle.isUpperObstacle ? 0 : gameAreaRef.current.offsetHeight - obstacle.height;
            const obstacleBottom = obstacle.isUpperObstacle ? obstacle.height : gameAreaRef.current.offsetHeight;
            
            if (
              fishRight > obstacleLeft && 
              100 < obstacleRight &&
              fishBottom > obstacleTop && 
              fishTop < obstacleBottom
            ) {
              setGameOver(true);
            }
          }
          
          // Check if passed
          if (!obstacle.passed && obstacle.x + 60 < 100) {
            setScore(prev => prev + 1);
            return { ...obstacle, x: obstacle.x - gameSpeed.current, passed: true };
          }
          
          return { ...obstacle, x: obstacle.x - gameSpeed.current };
        }).filter(obstacle => obstacle.x > -60);
      });

      // Move powerup
      if (flyPowerupVisible) {
        setFlyPowerupPosition(prev => ({ ...prev, x: prev.x - gameSpeed.current }));
        
        // Check powerup collision
        const powerupLeft = flyPowerupPosition.x;
        const powerupRight = flyPowerupPosition.x + 30;
        const powerupTop = flyPowerupPosition.y;
        const powerupBottom = flyPowerupPosition.y + 30;
        
        const fishRight = 100;
        const fishBottom = fishPosition + 40;
        const fishTop = fishPosition;
        
        if (
          fishRight > powerupLeft && 
          100 < powerupRight &&
          fishBottom > powerupTop && 
          fishTop < powerupBottom
        ) {
          activateFlying();
        }
        
        // Remove if off screen
        if (flyPowerupPosition.x < -30) {
          setFlyPowerupVisible(false);
        }
      }

      // Game over if fish hits top/bottom (unless flying)
      if (!isFlying && (fishPosition <= 0 || fishPosition >= gameAreaRef.current.offsetHeight - 40)) {
        setGameOver(true);
      }

      // Increase difficulty
      if (score > 0 && score % 5 === 0) {
        gameSpeed.current = 5 + Math.floor(score / 5);
      }
    };

    gameLoopRef.current = requestAnimationFrame(function gameLoop() {
      updateGameState();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    });

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [
    gameStarted, 
    gameOver, 
    fishPosition, 
    score, 
    isFlying, 
    flyPowerupActive, 
    flyPowerupVisible, 
    flyPowerupPosition, 
    activateFlying
  ]);

  // Obstacle generation timer
  useEffect(() => {
    if (gameStarted && !gameOver) {
      obstacleTimerRef.current = setInterval(generateObstacle, 1500);
      return () => clearInterval(obstacleTimerRef.current);
    }
  }, [gameStarted, gameOver, generateObstacle]);

  // Powerup generation timer
  useEffect(() => {
    if (gameStarted && !gameOver) {
      powerupTimerRef.current = setInterval(generatePowerup, 10000);
      return () => clearInterval(powerupTimerRef.current);
    }
  }, [gameStarted, gameOver, generatePowerup]);

  // Update high score
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  // Event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  return (
    <div className="game-container">
      <h1>Flying Fish Adventure</h1>
      <div className="score-board">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
        {flyPowerupActive && <div className="powerup-timer">FLYING: {Math.ceil(5000 - (performance.now() % 5000)) / 1000}s</div>}
      </div>
      
      <div 
        ref={gameAreaRef} 
        className="game-area" 
        onClick={handleJump}
      >
        {/* Ocean surface */}
        <div className="ocean-surface"></div>
        
        {/* Ocean floor */}
        <div className="ocean-floor"></div>
        
        {/* Fish */}
        <div 
          className={`fish ${isFlying ? 'flying' : ''}`} 
          style={{ 
            top: `${fishPosition}px`, 
            transform: `rotate(${fishRotation}deg)` 
          }}
        ></div>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div 
            key={obstacle.id}
            className={`obstacle ${obstacle.type} ${obstacle.isUpperObstacle ? 'upper' : 'lower'}`}
            style={{ 
              left: `${obstacle.x}px`,
              height: `${obstacle.height}px`,
              [obstacle.isUpperObstacle ? 'top' : 'bottom']: 0
            }}
          ></div>
        ))}
        
        {/* Flying powerup */}
        {flyPowerupVisible && (
          <div 
            className="powerup fly-powerup"
            style={{ 
              left: `${flyPowerupPosition.x}px`,
              top: `${flyPowerupPosition.y}px`
            }}
          ></div>
        )}
        
        {/* Game messages */}
        {!gameStarted && (
          <div className="game-message">
            <h2>Click or Press Space to Start</h2>
            <p>Avoid obstacles and collect the powerup to fly!</p>
          </div>
        )}
        
        {gameOver && (
          <div className="game-message">
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <button onClick={handleJump}>Play Again</button>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <p>Controls: Click, Space, or Arrow Up to make the fish jump</p>
        <p>Collect the powerup to fly for 5 seconds!</p>
      </div>
    </div>
  );
};

export default Game;