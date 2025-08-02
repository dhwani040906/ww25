import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const threats = [
  {
    title: 'Plastic Pollution',
    description: 'Over 8 million tons of plastic enter the ocean each year, harming marine life and ecosystems. Plastics are mistaken for food by marine animals, which can lead to starvation and death. Microplastics also enter the food chain, affecting humans too.',
    image: '/images/plastic.jpg',
  },
  {
    title: 'Coral Bleaching',
    description: 'Rising sea temperatures cause coral reefs to expel algae, turning them white and leading to biodiversity loss. Coral bleaching is a signal of climate change and severely impacts marine species that depend on coral ecosystems.',
    image: '/images/coral.jpg',
  },
  {
    title: 'Overfishing',
    description: 'Excessive fishing depletes fish populations, damages habitats, and disrupts ocean food chains. This results in ecological imbalance and threatens the survival of dependent species and human communities relying on fish as a food source.',
    image: '/images/overfishing.jpg',
  },
  {
    title: 'Oil Spills',
    description: 'Oil spills create long-lasting damage, coating marine life and habitats in toxic substances. Recovery from oil spills can take decades, and cleanup efforts are often insufficient to restore the original ecosystem.',
    image: '/images/oilspill.jpg',
  },
  {
    title: 'Ocean Acidification',
    description: 'CO₂ absorbed by oceans lowers pH levels, weakening the shells of marine creatures like corals and mollusks. This disrupts marine ecosystems and food chains, especially in polar and tropical regions.',
    image: '/images/acidification.jpg',
  },
  {
    title: 'Noise Pollution',
    description: 'Ship traffic and drilling produce underwater noise that confuses marine mammals and affects navigation, mating, and hunting. Species like whales and dolphins are particularly affected due to their reliance on echolocation.',
    image: '/images/noise.jpg',
  },
];

export default function ThreatsPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <TopBar>
        <HomeButton onClick={() => navigate('/')}>← Home</HomeButton>
        <Title>Ocean Threats</Title>
      </TopBar>

      <ThreatList>
        {threats.map((threat, index) => (
          <ThreatCard key={index}>
            <ThreatImage src={threat.image} alt={threat.title} />
            <ThreatText>
              <ThreatTitle>{threat.title}</ThreatTitle>
              <ThreatDescription>{threat.description}</ThreatDescription>
            </ThreatText>
          </ThreatCard>
        ))}
      </ThreatList>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  background: linear-gradient(135deg, #000814, #001f3f);
  min-height: 100vh;
  color: white;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  overflow-y: auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const HomeButton = styled.button`
  background: transparent;
  border: 2px solid #00eaff;
  color: #00eaff;
  border-radius: 25px;
  padding: 6px 18px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 20px;

  &:hover {
    background: #00eaff;
    color: #000814;
  }
`;

const Title = styled.h1`
  font-size: 2.4rem;
  color: #00bfff;
  font-family: 'Orbitron', sans-serif;
`;

const ThreatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const ThreatCard = styled.div`
  display: flex;
  flex-direction: row;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 234, 255, 0.1);
  backdrop-filter: blur(6px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ThreatImage = styled.img`
  width: 300px;
  height: 220px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ThreatText = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ThreatTitle = styled.h2`
  font-size: 1.6rem;
  color: #00eaff;
`;

const ThreatDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 10px;
`;