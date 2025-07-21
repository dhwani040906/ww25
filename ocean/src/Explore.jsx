import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const cards = [
  {
    id: 0,
    title: 'Gallery',
    description: 'Explore marine life through visuals, artwork, and real underwater wonders.',
  },
  {
    id: 1,
    title: 'Ships',
    description: 'Sail through history with legendary ocean vessels and their stories.',
  },
  {
    id: 2,
    title: 'Game',
    description: 'Play an exciting underwater-themed game packed with fun and challenges.',
  },
  {
    id: 3,
    title: 'Quiz',
    description: 'Test your marine knowledge with fun and educational quizzes.',
  }
];

export default function Explore() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const getPosition = (index) => {
    const relative = (index - activeIndex + cards.length) % cards.length;

    switch (relative) {
      case 0: return 'center';
      case 1: return 'right';
      case cards.length - 1: return 'left';
      default: return 'hidden';
    }
  };

  return (
    <div className="explore-page">
      <button className="explore-home-button" onClick={() => navigate('/')}>Home</button>

      {/* Title, Info & Go Button */}
      <div className="explore-top-info">
        <h1>{cards[activeIndex].title}</h1>
        <p className="explore-top-description">{cards[activeIndex].description}</p>
        <button onClick={() => navigate(`/${cards[activeIndex].title.toLowerCase()}`)}
          className="explore-go-btn">
          Go to {cards[activeIndex].title}
        </button>
      </div>

      {/* Card Carousel */}
      <div className="explore-carousel">
        <button className="explore-arrow explore-left" onClick={rotateLeft}>&lt;</button>

        {cards.map((card, index) => {
          const pos = getPosition(index);
          return (
            <div key={card.id} className={`explore-card ${pos}`}>
              <h3>{card.title}</h3>
            </div>
          );
        })}

        <button className="explore-arrow explore-right" onClick={rotateRight}>&gt;</button>
      </div>
    </div>
  );
}