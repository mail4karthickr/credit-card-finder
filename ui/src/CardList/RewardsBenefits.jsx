import React from 'react';
import styled from 'styled-components';

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 900px;
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
    background: rgba(211, 47, 47, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(211, 47, 47, 0.5);
    }
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
`;

const Subtitle = styled.div`
  font-size: 1.1rem;
  opacity: 0.95;
  font-weight: 500;
`;

const Content = styled.div`
  padding: 2rem;
`;

const BenefitCard = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #d32f2f;
  transition: all 0.3s ease;
  
  &:hover {
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BenefitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const BenefitTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  flex: 1;
`;

const BenefitDescription = styled.div`
  color: #555;
  line-height: 1.7;
  font-size: 0.95rem;
  
  p {
    margin: 0 0 1rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: #d32f2f;
    font-weight: 600;
  }
  
  a {
    color: #d32f2f;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  br {
    display: block;
    content: "";
    margin-top: 0.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #999;
`;

// Helper function to strip HTML and parse content
const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary textarea to decode HTML entities
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  const decoded = txt.value;
  
  // Remove HTML tags
  return decoded.replace(/<[^>]*>/g, '').trim();
};

// Helper function to parse HTML and preserve formatting
const ParsedContent = ({ html }) => {
  if (!html) return null;
  
  // Strip HTML tags and entities for clean text display
  const cleanText = stripHtml(html);
  
  return (
    <BenefitDescription>{cleanText}</BenefitDescription>
  );
};

// Icon mapping for different benefit types
const getIconForBenefit = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('cellular') || lowerTitle.includes('phone') || lowerTitle.includes('protection')) {
    return '📱';
  } else if (lowerTitle.includes('roadside') || lowerTitle.includes('dispatch') || lowerTitle.includes('towing')) {
    return '🚗';
  } else if (lowerTitle.includes('concierge') || lowerTitle.includes('visa signature')) {
    return '🎩';
  } else if (lowerTitle.includes('travel') || lowerTitle.includes('trip')) {
    return '✈️';
  } else if (lowerTitle.includes('purchase') || lowerTitle.includes('shopping')) {
    return '🛍️';
  } else if (lowerTitle.includes('warranty') || lowerTitle.includes('extended')) {
    return '🛡️';
  } else if (lowerTitle.includes('insurance') || lowerTitle.includes('coverage')) {
    return '🔒';
  } else if (lowerTitle.includes('reward') || lowerTitle.includes('cash') || lowerTitle.includes('points')) {
    return '💰';
  } else if (lowerTitle.includes('dining') || lowerTitle.includes('restaurant')) {
    return '🍽️';
  } else if (lowerTitle.includes('hotel') || lowerTitle.includes('lodging')) {
    return '🏨';
  } else {
    return '⭐';
  }
};

const RewardsBenefits = ({ data, cardTitle, onClose }) => {
  console.log('🎁 RewardsBenefits component:', { data, cardTitle });
  
  if (!data) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>
            <CloseButton onClick={onClose}>×</CloseButton>
            <Title>Rewards & Benefits</Title>
          </Header>
          <EmptyState>No benefits data available</EmptyState>
        </Modal>
      </Overlay>
    );
  }
  
  // Extract benefits from data
  const benefits = [];
  
  for (let i = 1; i <= 9; i++) {
    const titleKey = `feature${i}_title`;
    const contentKey = `feature${i}_content`;
    
    if (data[titleKey] && data[contentKey] && data[contentKey].length > 0) {
      benefits.push({
        title: stripHtml(data[titleKey]),
        content: data[contentKey][0],
        icon: getIconForBenefit(data[titleKey])
      });
    }
  }
  
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose}>×</CloseButton>
          <Title>{data.title ? stripHtml(data.title) : 'Feature and benefit terms'}</Title>
          <Subtitle>{cardTitle || (data.subtitle ? stripHtml(data.subtitle) : '')}</Subtitle>
        </Header>
        
        <Content>
          {benefits.length > 0 ? (
            benefits.map((benefit, index) => (
              <BenefitCard key={index}>
                <BenefitHeader>
                  <IconWrapper>{benefit.icon}</IconWrapper>
                  <BenefitTitle>{benefit.title}</BenefitTitle>
                </BenefitHeader>
                <ParsedContent html={benefit.content} />
              </BenefitCard>
            ))
          ) : (
            <EmptyState>No benefits available for this card</EmptyState>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default RewardsBenefits;
