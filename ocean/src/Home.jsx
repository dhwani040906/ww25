import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Logo from './Logo'
import diveimg from './assets/home_dive.jpg';
import galleryimg from './assets/home_gallery.jpg';
import threatsimg from './assets/home_threats.jpg';
import solutionsimg from './assets/home_solutions.jpg';
import aboutimg from './assets/home_about.jpg';
import communityimg from './assets/home_community.jpg';

const cards = [
    {
        title: "Dive In",
        image: diveimg,
        description: "Dive into the depths of the oceans to uncover their mysteries and magic."
    },
    {
        title: "Explore",
        image: galleryimg,
        description: "Discover a stunning gallery of marine life, plants, and underwater beauty."
    },
    {
        title: "Threats",
        image: threatsimg,
        description: "Learn about the serious threats oceans face like pollution and climate change."
    },
    {
        title: "Solutions",
        image: solutionsimg,
        description: "Explore the steps taken globally to protect and preserve oceanic ecosystems."
    },
    {
        title: "Community",
        image: communityimg,
        description: "Join hands with a growing community of ocean lovers and activists."
    },
    {
        title: "About",
        image: aboutimg,
        description: "Know more about our mission, values, and the team behind this platform."
    }
];

function Home() {
    const [hoverIndex, setHoverIndex] = useState(0);
    const activeCard = cards[hoverIndex];
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Top Taskbar */}
            <div className="home-taskbar">
                <button className="home-login" onClick={()=>navigate('/login')}>Login</button>

                <Logo className="home-logo-dv"/>

                <button className="home-logout">Logout</button>
            </div>

            {/* home */}
            <div className="home-main-section">
                {/* info */}
                <div className="home-hero-content">
                    <h1 className="home-heading">{activeCard.title}</h1>
                    <p className="home-lines">{activeCard.description}</p>
                </div>

                {/* Scroll */}
                <div className="home-scroll-wrapper">
                    <div className="home-scroll-bar">
                        <div className="home-card-container">
                            {cards.map((card, index) => (
                                <button
                                    key={index}
                                    className={`home-card ${index === hoverIndex ? 'active' : ''}`}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onClick={() => navigate(`/${card.title.toLowerCase()}`)}
                                >
                                    <img src={card.image} alt={card.title} />
                                    <div className="home-card-title">{card.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;