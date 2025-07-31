import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './Logo';

import diveimg from './assets/home_dive.jpg';
import galleryimg from './assets/home_gallery.jpg';
import threatsimg from './assets/home_threats.jpg';
import solutionsimg from './assets/home_solutions.jpg';
import aboutimg from './assets/home_about.jpg';
import communityimg from './assets/home_community.jpg';

const cards = [
    { title: "Dive In", image: diveimg, description: "Dive into the depths of the oceans to uncover their mysteries and magic." },
    { title: "Explore", image: galleryimg, description: "Discover a stunning gallery of marine life, plants, and underwater beauty." },
    { title: "Threats", image: threatsimg, description: "Learn about the serious threats oceans face like pollution and climate change." },
    { title: "Solutions", image: solutionsimg, description: "Explore the steps taken globally to protect and preserve oceanic ecosystems." },
    { title: "Community", image: communityimg, description: "Join hands with a growing community of ocean lovers and activists." },
    { title: "About", image: aboutimg, description: "Know more about our mission, values, and the team behind this platform." }
];

export default function Home() {
    const [hoverIndex, setHoverIndex] = useState(0);
    const activeCard = cards[hoverIndex];
    const navigate = useNavigate();

    return (
        <Container>
            <Taskbar>
                <AuthButton onClick={() => navigate('/login')}>Login</AuthButton>
                <LogoWrapper><Logo /></LogoWrapper>
                <AuthButton onClick={() => navigate('/logout')}>Logout</AuthButton>
            </Taskbar>

            <MainSection>
                <HeroContent>
                    <Heading>{activeCard.title}</Heading>
                    <Description>{activeCard.description}</Description>
                </HeroContent>

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
const Container = styled.div`
  font-family: 'Segoe UI', sans-serif;
  color: white;
  background: linear-gradient(135deg, #0b0c2a, #000814);
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

const Taskbar = styled.div`
  width: 100%;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AuthButton = styled.button`
  background: transparent;
  border: 2px solid #00eaff;
  padding: 8px 20px;
  border-radius: 25px;
  font-weight: bold;
  color: #00eaff;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background-color: #00eaff;
    color: #001f3f;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;

  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 1000px) {
    max-width: 90%;
    align-items: center;
    text-align: center;
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #00bfff;
  font-family: 'Orbitron', sans-serif;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ScrollWrapper = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 1000px) {
    max-width: 90%;
  }
`;

const ScrollBar = styled.div`
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardContainer = styled.div`
  display: flex;
  gap: 20px;
  scroll-snap-type: x mandatory;
`;

const Card = styled.button`
  scroll-snap-align: start;
  width: 230px;
  height: 280px;
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
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1rem;
  text-align: center;
  pointer-events: none;
`;