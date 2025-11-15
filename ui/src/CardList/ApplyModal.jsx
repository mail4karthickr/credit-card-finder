import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ApplyNowButton
} from './CardList.styles';

const ApplyModal = ({ card, onClose }) => {
  useEffect(() => {
    // Request fullscreen display mode when modal loads
    const requestDisplayMode = async () => {
      try {
        await window.openai?.requestDisplayMode({ mode: "fullscreen" });
        console.log('✅ Display mode set to fullscreen');
      } catch (error) {
        console.error('❌ Failed to set display mode:', error);
      }
    };
    
    requestDisplayMode();
  }, []);

  const handleApplyNow = () => {
    // Open Wells Fargo application page
    console.log('Apply for:', card.title);
    window.open('https://www.wellsfargo.com/credit-cards/', '_blank');
    onClose();
  };

  return (
    <Modal>
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Apply for {card.title}</ModalTitle>
          <ModalCloseButton onClick={onClose}>
            ✕
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#1a1a1a'
            }}>
              Ready to Apply?
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              color: '#666', 
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              You'll be redirected to Wells Fargo's secure application page to complete your credit card application for the <strong>{card.title}</strong>.
            </p>
            
            {card.feature6_content && card.feature6_content[0] && (
              <div style={{
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.25rem' }}>
                  Annual Fee
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  color: card.feature6_content[0] === '$0' ? '#4caf50' : '#333'
                }}>
                  {card.feature6_content[0]}
                </div>
              </div>
            )}
            
            {/* Intro Offer */}
            {card.feature4_content && card.feature4_content[0] && (
              <div style={{
                background: '#fff3e0',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'left',
                border: '1px solid #ffe0b2'
              }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#f57c00', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  🎁 Intro Offer
                </div>
                <div style={{ 
                  fontSize: '0.95rem', 
                  color: '#333',
                  lineHeight: '1.5'
                }}>
                  {card.feature4_content[0].replace(/<[^>]*>/g, '')}
                </div>
              </div>
            )}
            
            {/* Rewards */}
            {card.feature5_content && card.feature5_content[0] && (
              <div style={{
                background: '#e8f5e9',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'left',
                border: '1px solid #c8e6c9'
              }}>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#388e3c', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  💎 Rewards
                </div>
                <div style={{ 
                  fontSize: '0.95rem', 
                  color: '#333',
                  lineHeight: '1.5'
                }}>
                  {card.feature5_content[0].replace(/<[^>]*>/g, '')}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'white',
                  color: '#333',
                  border: '2px solid #d4d4d4',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                Cancel
              </button>
              <ApplyNowButton
                onClick={handleApplyNow}
                style={{
                  flex: 1,
                  margin: 0
                }}
              >
                Apply Now →
              </ApplyNowButton>
            </div>
            
            <p style={{
              fontSize: '0.75rem',
              color: '#999',
              marginTop: '1.5rem',
              lineHeight: '1.4'
            }}>
              By continuing, you will be directed to wellsfargo.com. Wells Fargo Bank, N.A. Member FDIC.
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ApplyModal;
