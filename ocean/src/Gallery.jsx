import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Gallery.css';

import fishImg from './assets/gallery_fishes.jpg';
import plantImg from './assets/gallery_plants.jpg';
import shellImg from './assets/gallery_shells.jpg';

export default function Gallery() {
  const navigate = useNavigate();

  return (
    <div className="gallery-page">
      <h1 className="gallery-heading">Gallery.</h1>
      <p className="gallery-info">
        Discover the marine life through vibrant visuals. Dive deep into the world of <br />
        fishes, plants, and shells through immersive ocean photography and design.
      </p>

      <div className="gallery-cards">
        <div className="gallery-card" onClick={() => navigate('/fishes')}>
          <img src={fishImg} alt="Fishes" />
          <h3>Fishes.</h3>
        </div>
        <div className="gallery-card" onClick={() => navigate('/plants')}>
          <img src={plantImg} alt="Plants" />
          <h3>Plants.</h3>
        </div>
        <div className="gallery-card" onClick={() => navigate('/shells')}>
          <img src={shellImg} alt="Shells" />
          <h3>Shells.</h3>
        </div>
      </div>
    </div>
  );
}