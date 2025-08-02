import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './Logo';
// import VantaBackground from './VantaBackground';
// import OceanScene from './OceanScene.jsx';

import oceanVideo from './assets/home_bg.mp4.mp4';
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
    description: "Dive into the depths of the oceans to uncover their mysteries and magic.",
  },
  {
    title: "Explore",
    image: galleryimg,
    description: "Discover a stunning gallery of marine life, plants, and underwater beauty.",
  },
  {
    title: "Threats",
    image: threatsimg,
    description: "Learn about the serious threats oceans face like pollution and climate change.",
  },
  {
    title: "Solutions",
    image: solutionsimg,
    description: "Explore the steps taken globally to protect and preserve oceanic ecosystems.",
  },
  {
    title: "Community",
    image: communityimg,
    description: "Join hands with a growing community of ocean lovers and activists.",
  },
  {
    title: "About",
    image: aboutimg,
    description: "Know more about our mission, values, and the team behind this platform.",
  },
];

export default function Home() {
  const [hoverIndex, setHoverIndex] = useState(0);
  const activeCard = cards[hoverIndex];
  const navigate = useNavigate();

  return (
    <Container>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <source src={oceanVideo} type="video/mp4" />
      </video>
      <Taskbar>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <ButtonGroup>
          <AuthButton onClick={() => navigate('/login')}>Login</AuthButton>
          <AuthButton onClick={() => navigate('/logout')}>Logout</AuthButton>
        </ButtonGroup>
      </Taskbar>

      <MainSection>
        <HeroContent>
          <Heading>{activeCard.title}</Heading>
          <Description>{activeCard.description}</Description>
        </HeroContent>

        <Spacer /> {/* added spacing between description and scroll area */}

        <ScrollWrapper>
          <ScrollBar>
            <CardContainer>
              {cards.map((card, index) => (
                <Card
                  key={index}
                  active={index === hoverIndex}
                  onMouseEnter={() => setHoverIndex(index)}
                  onClick={() => navigate(`/${card.title.toLowerCase()}`)}
                >
                  <img src={card.image} alt={card.title} />
                  <CardTitle>{card.title}</CardTitle>
                </Card>
              ))}
            </CardContainer>
          </ScrollBar>
        </ScrollWrapper>
      </MainSection>
    </Container>
  );
}

// Styled Components
// linear-gradient(135deg, #0b0c2a, #000814);
const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  color: white;
  background: transparent;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1;

`;

const Taskbar = styled.div`
  width: 100%;
  padding: 10px 25px 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 600px) {
    padding: 10px 12px 0 8px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  img {
    max-height: 110px;
    object-fit: contain;

    @media (max-width: 600px) {
      max-height: 75px;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const AuthButton = styled.button`
  background: transparent;
  border: 2px solid #00eaff;
  padding: 6px 18px;
  border-radius: 25px;
  font-weight: bold;
  color: #00eaff;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: #00eaff;
    color: #001f3f;
  }

  @media (max-width: 500px) {
    padding: 5px 12px;
    font-size: 0.8rem;
  }
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  margin-top: 200px;

  @media (max-width: 600px){
    margin-top: 40px;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin-top: 0px;
  margin-bottom: 50px;
`;

// text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
const Heading = styled.h1`
  font-size: 5rem;
  margin-bottom: 10px;
  color: #00bfff;
  font-family: 'Orbitron', sans-serif;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.2);
  text-shadow: 100px 100px 100px rgba(0, 0, 0, 0.1);
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.2);
  text-shadow: 100px 100px 100px rgba(0, 0, 0, 0.1);
`;

const Spacer = styled.div`
  height: 70px; // adjust spacing between description and cards here
`;

const ScrollWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
  padding-bottom: 40px; // extra space below scroll bar
  @media (max-width: 600px) {
    padding-bottom: 30px;
  }
`;

const ScrollBar = styled.div`
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  scroll-snap-type: x mandatory;
  padding: 10px 0;
`;

const Card = styled.button`
  scroll-snap-align: start;
  width: 200px;
  height: 250px;
  margin-right: 20px;
  background-color: #000814;
  border: none;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  ${({ active }) =>
    active &&
    `
    transform: scale(1.07);
    z-index: 2;
  `}

  &:hover {
    transform: scale(1.05);
  }
`;

const CardTitle = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.95rem;
  text-align: center;
  pointer-events: none;
`;