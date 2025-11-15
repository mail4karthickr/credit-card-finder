import React from 'react';
import styled from 'styled-components';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Header = styled.div`
  padding: 32px;
  border-bottom: 2px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #d32f2f;
  margin: 0 0 8px 0;
  font-weight: 700;
`;

const Subtitle = styled.h3`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: #f5f5f5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0e0e0;
    transform: scale(1.1);
  }
`;

const Body = styled.div`
  padding: 32px;
`;

const FeatureSection = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 12px;
  border-left: 4px solid #d32f2f;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureTitle = styled.h4`
  font-size: 1.2rem;
  color: #d32f2f;
  margin: 0 0 16px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FeatureContent = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  
  p {
    margin: 0 0 12px 0;
  }
  
  a {
    color: #d32f2f;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  strong {
    color: #d32f2f;
    font-weight: 600;
  }
  
  ul, ol {
    margin: 12px 0;
    padding-left: 24px;
  }
  
  li {
    margin: 8px 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
`;

const Icon = styled.span`
  font-size: 1.4rem;
`;

// Helper function to parse HTML and create React elements safely
const parseHtmlContent = (html) => {
  if (!html) return null;
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  return temp.textContent || temp.innerText || '';
};

// Helper to render HTML content with links
const renderContent = (htmlString) => {
  if (!htmlString) return null;
  
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
};

const FeatureBenefits = ({ data, onClose }) => {
  if (!data) return null;
  
  // Extract all features
  const features = [];
  for (let i = 1; i <= 9; i++) {
    const titleKey = `feature${i}_title`;
    const contentKey = `feature${i}_content`;
    
    if (data[titleKey] && data[contentKey] && data[contentKey].length > 0) {
      features.push({
        title: data[titleKey],
        content: data[contentKey]
      });
    }
  }
  
  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <CloseButton onClick={onClose} aria-label="Close">×</CloseButton>
          <Title>{data.title || 'Feature and benefit terms'}</Title>
          <Subtitle>{data.subtitle}</Subtitle>
        </Header>
        
        <Body>
          {features.length === 0 ? (
            <EmptyState>
              No feature and benefit information available.
            </EmptyState>
          ) : (
            features.map((feature, index) => (
              <FeatureSection key={index}>
                <FeatureTitle>
                  <Icon>
                    {index === 0 ? '💰' : 
                     index === 1 ? '✈️' : 
                     index === 2 ? '🧳' : 
                     index === 3 ? '📱' : 
                     index === 4 ? '🚗' : 
                     index === 5 ? '🎯' : '✨'}
                  </Icon>
                  {feature.title}
                </FeatureTitle>
                <FeatureContent>
                  {feature.content.map((contentItem, contentIndex) => (
                    <div key={contentIndex}>
                      {renderContent(contentItem)}
                    </div>
                  ))}
                </FeatureContent>
              </FeatureSection>
            ))
          )}
        </Body>
      </ModalContent>
    </Modal>
  );
};

export default FeatureBenefits;
