import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export const ScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem;
  scroll-behavior: smooth;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

// Card flip container
export const CardContainer = styled.div`
  width: 290px;
  min-width: 290px;
  max-width: 290px;
  height: 720px;
  perspective: 1000px;
  flex-shrink: 0;
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

export const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

export const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(180deg);
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar for back side */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e0e0e0;
  margin: 0;
  display: flex;
  flex-direction: column;
  
  ${CardFront}:hover & {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

// Apply Now button
export const ApplyNowButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #c62828 0%, #a31515 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(211, 47, 47, 0.3);
  }
`;

// View Details button (for opening apply modal)
export const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  margin-top: auto;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #c62828 0%, #a31515 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(211, 47, 47, 0.3);
  }
`;

// Learn More button
export const LearnMoreButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: #333;
  border: 2px solid #d4d4d4;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
    border-color: #999;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    background: #e8e8e8;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Back button
export const BackButton = styled.button`
  width: 100%;
  padding: 0.65rem;
  margin-top: 0.75rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #555;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Back side styles
export const BackTitle = styled.h2`
  font-size: 1.15rem;
  margin: 0 0 0.75rem 0;
  color: #1a1a1a;
  font-weight: 600;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 0.4rem;
`;

export const BackContent = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0.75rem;
`;

export const BackSection = styled.div`
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const BackLabel = styled.div`
  font-weight: 600;
  color: #d32f2f;
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const BackText = styled.div`
  color: ${props => props.isFree ? '#4caf50' : '#333'};
  font-size: 0.85rem;
  line-height: 1.4;
  font-weight: ${props => props.isFree ? '600' : 'normal'};
`;

export const CardImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 140px;
  object-fit: cover;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: transparent;
  padding: 0;
`;

export const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.75rem;
  white-space: nowrap;
  width: fit-content;
  
  ${props => {
    const colors = {
      cashback: 'background: #e3f2fd; color: #1976d2;',
      travel: 'background: #f3e5f5; color: #7b1fa2;',
      introrate: 'background: #e8f5e9; color: #388e3c;',
      rewards: 'background: #fff3e0; color: #f57c00;',
    };
    return colors[props.category] || 'background: #f5f5f5; color: #666;';
  }}
`;

export const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.4rem 0;
  color: #1a1a1a;
  font-weight: 600;
`;

export const CardSubtitle = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

export const Feature = styled.div`
  margin: 0.75rem 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
`;

export const FeatureLabel = styled.div`
  font-weight: 600;
  color: #d32f2f;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FeatureValue = styled.div`
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AnnualFee = styled.div`
  margin-top: 0.75rem;
  margin-bottom: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.isFree ? '#4caf50' : '#333'};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.2rem;
`;

// Shimmer loading styles
export const ShimmerCard = styled.div`
  width: 290px;
  min-width: 290px;
  max-width: 290px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  overflow: hidden;
  position: relative;
  margin: 0;
`;

export const ShimmerWrapper = styled.div`
  position: relative;
  overflow: hidden;
  background: #e0e0e0;
  border-radius: 6px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;

export const ShimmerImage = styled(ShimmerWrapper)`
  width: 100%;
  height: 140px;
  margin-bottom: 0.75rem;
  border-radius: 8px;
`;

export const ShimmerTitle = styled(ShimmerWrapper)`
  width: 80%;
  height: 30px;
  margin-bottom: 0.4rem;
`;

export const ShimmerSubtitle = styled(ShimmerWrapper)`
  width: 100%;
  height: 24px;
  margin-bottom: 0.75rem;
`;

export const ShimmerFeature = styled(ShimmerWrapper)`
  width: 100%;
  height: 80px;
  margin: 0.75rem 0;
  background: #f0f0f0;
`;

// Compare Button styles
export const CompareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: calc(100% - 2rem);
  margin: 0 1rem 1rem 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(211, 47, 47, 0.4);
    background: linear-gradient(135deg, #c62828 0%, #a31515 100%);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
  }
  
  &:focus {
    outline: 3px solid rgba(211, 47, 47, 0.3);
    outline-offset: 2px;
  }
`;

export const CompareIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
`;

export const CompareText = styled.span`
  letter-spacing: 0.3px;
`;

// Modal styles
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  padding-right: 1rem;
  line-height: 1.3;
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #999;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }
  
  &:active {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(0.95);
  }
`;

export const ModalBody = styled.div`
  padding: 0;
`;
