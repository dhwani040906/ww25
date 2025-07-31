import styled, { keyframes } from 'styled-components';
import logo from './assets/deepverse_logo.png';

const pulseGlow = keyframes`
  0% {
    filter: drop-shadow(0 0 5px #00eaff) drop-shadow(0 0 10px #00eaff);
  }
  50% {
    filter: drop-shadow(0 0 12px #00eaff) drop-shadow(0 0 25px #00eaff);
  }
  100% {
    filter: drop-shadow(0 0 5px #00eaff) drop-shadow(0 0 10px #00eaff);
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 160px;
  height: auto;
  animation: ${pulseGlow} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 120px;
  }
`;

function Logo() {
  return (
    <LogoWrapper>
      <LogoImage src={logo} alt="Deep Verse Logo" />
    </LogoWrapper>
  );
}

export default Logo;