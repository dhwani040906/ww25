
import React, { useState, useEffect } from 'react';
// import './Threats.css';

const AquaticThreatsWebsite = () => {
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const animals = [
    {
      id: 1,
      name: "Sea Turtle",
      emoji: "🐢",
      threats: [
        "Plastic pollution - mistaking plastic bags for jellyfish",
        "Coastal development destroying nesting beaches",
        "Climate change affecting sand temperature and sex ratios",
        "Fishing nets causing accidental capture"
      ],
      color: "#2E8B57",
      status: "Endangered"
    },
    {
      id: 2,
      name: "Dolphin",
      emoji: "🐬",
      threats: [
        "Chemical runoff, heavy metals, and plastic waste weaken dolphins’ immune systems and can cause reproductive failure and cancerous tumors",
        "- Climate change affects food availability and migration",
        "Pollution from coastal runoff",
        "Destructive fishing practices"
      ],
      color: "#7856ceff",
      status: "Critically Threatened"
    },
    {
      id: 3,
      name: "Whale",
      emoji: "🐋",
      threats: [
        "Ship strikes in busy shipping lanes",
        "Noise pollution disrupting communication",
        "Plastic ingestion and entanglement",
        "Climate change affecting food sources"
      ],
      color: "#3b5468ff",
      status: "Vulnerable"
    },
    {
      id: 4,
      name: "Polar Bear",
      emoji: "🐻‍❄️",
      threats: [
        "Arctic ice loss due to global warming",
        "Reduced hunting grounds for seals",
        "Pollution affecting food chain",
        "Human encroachment on habitat"
      ],
      color: "#9ed5eaff",
      status: "Vulnerable"
    },
    
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnimal((prev) => (prev + 1) % animals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        setIsVisible(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critically Threatened': return '#f33333ff';
      case 'Endangered': return '#FF8800';
      case 'Vulnerable': return '#FFAA00';
      case 'Threatened': return '#FFD700';
      default: return '#888';
    }
  };

  return (
    <div className="website-container">
      <header className="hero-section">
        <div className="ocean-waves">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Threats to Our Ocean Friends</h1>
          <p className="hero-subtitle">Understanding the challenges facing aquatic life</p>
          <div className="floating-bubbles">
            <div className="bubble bubble1"></div>
            <div className="bubble bubble2"></div>
            <div className="bubble bubble3"></div>
            <div className="bubble bubble4"></div>
          </div>
        </div>
      </header>

    
      <section className="carousel-section">
        <div className="carousel-container">
          <div 
            className="animal-showcase"
            style={{ backgroundColor: animals[currentAnimal].color + '20' }}
          >
            <div className="animal-display">
              <div className="animal-emoji rotating">{animals[currentAnimal].emoji}</div>
              <h2 className="animal-name">{animals[currentAnimal].name}</h2>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(animals[currentAnimal].status) }}
              >
                {animals[currentAnimal].status}
              </div>
            </div>
            <div className="threats-preview">
              <h3>Major Threats:</h3>
              <ul>
                {animals[currentAnimal].threats.slice(0, 2).map((threat, index) => (
                  <li key={index} className="threat-item">{threat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="carousel-indicators">
          {animals.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentAnimal ? 'active' : ''}`}
              onClick={() => setCurrentAnimal(index)}
            />
          ))}
        </div>
      </section>

      
      <main className="main-content">
        {animals.map((animal, index) => (
          <section 
            key={animal.id} 
            id={`animal-${index}`}
            className={`animal-section animate-on-scroll ${isVisible[`animal-${index}`] ? 'visible' : ''}`}
            style={{ '--accent-color': animal.color }}
          >
            <div className="section-content">
              <div className="animal-header">
                <div className="animal-icon pulsing">{animal.emoji}</div>
                <div className="animal-info">
                  <h2 className="section-title">{animal.name}</h2>
                  <div 
                    className="status-tag"
                    style={{ backgroundColor: getStatusColor(animal.status) }}
                  >
                    Status: {animal.status}
                  </div>
                </div>
              </div>
              
              <div className="threats-grid">
                <h3 className="threats-title">Critical Threats:</h3>
                <div className="threats-list">
                  {animal.threats.map((threat, threatIndex) => (
                    <div 
                      key={threatIndex} 
                      className="threat-card"
                      style={{ animationDelay: `${threatIndex * 0.1}s` }}
                    >
                      <div className="threat-number">{threatIndex + 1}</div>
                      <p className="threat-text">{threat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
      <section className="cta-section animate-on-scroll" id="cta">
        <div className="cta-content">
          <h2 className="cta-title">Take Action Today</h2>
          <p className="cta-text">
            Every action counts in protecting our precious marine life. 
            Together we can make a difference for future generations.
          </p>
          <div className="action-buttons">
            <button className="cta-button primary">Learn More</button>
            <button className="cta-button secondary">Donate</button>
          </div>
        </div>
        <div className="swimming-fish">
          <div className="fish">🐠</div>
          <div className="fish">🐟</div>
          <div className="fish">🦈</div>
        </div>
      </section>

      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Aquatic Conservation Initiative. Protecting marine life for future generations.</p>
          <div className="ocean-icons">
            <span>🌊</span>
            <span>🐬</span>
            <span>🐋</span>
            <span>🐢</span>
          <span>🌊</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AquaticThreatsWebsite;
