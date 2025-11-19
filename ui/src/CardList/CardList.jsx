import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useToolOutput } from '../hooks.js';
import RewardsBenefits from './RewardsBenefits.jsx';
import RatesFees from './RatesFees.jsx';
import ApplyModal from './ApplyModal.jsx';
import {
  Container,
  ScrollContainer,
  CardContainer,
  CardInner,
  CardFront,
  CardBack,
  Card,
  CardImage,
  CardTitle,
  CardSubtitle,
  CategoryBadge,
  Feature,
  FeatureLabel,
  FeatureValue,
  AnnualFee,
  LearnMoreButton,
  ViewDetailsButton,
  BackButton,
  BackContent,
  BackTitle,
  BackSection,
  BackLabel,
  BackText,
  EmptyState,
  ShimmerCard,
  ShimmerImage,
  ShimmerTitle,
  ShimmerSubtitle,
  ShimmerFeature
} from './CardList.styles';

// Import all credit card images - Vite will bundle these
import activeCashImg from './images/WF_ActiveCash_VS_Collateral_Front_RGB_714x450.png';
import attuneImg from './images/WF_Attune_Front_RGB_714x450.png';
import autographNoFeeImg from './images/WF_Autograph_NoFee_VisaSignature_Front_Optimized_RGB.png';
import autographJourneyImg from './images/Autograph_Journey_No_Flag.png';
import choiceFeeImg from './images/WF_Choice_Fee_Front_Optimized_RGB.png';
import choiceNoFeeImg from './images/WF_Choice_NoFee_Front_Optimized_RGB.png';
import oneKeyFeeImg from './images/EP_OneKey_Fee_Front_Optimized_RGB.png';
import oneKeyNoFeeImg from './images/EP_OneKey_NoFee_Front_Optimized_RGB.png';
import reflectImg from './images/WF_Reflect_Front_Optimized_RGB.png';
import placeholderImg from './images/placeholder.svg';

console.log('🎯 CardList module loaded');

// Map card titles to imported images (exact matches from data.json)
const imageMap = {
  'Active Cash®': activeCashImg,
  'Attune®': attuneImg,
  'Autograph®': autographNoFeeImg,
  'Autograph Journey℠': autographJourneyImg,
  'Choice Privileges®': choiceFeeImg,
  'Choice Privileges® Mastercard®': choiceNoFeeImg,
  'One Key™ Card': oneKeyNoFeeImg,
  'One Key+™ Card': oneKeyFeeImg,
  'Reflect®': reflectImg,
};

const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary div to decode HTML entities
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  const decoded = txt.value;
  
  // Remove HTML tags
  return decoded.replace(/<[^>]*>/g, '').trim();
};

const getCardImage = (cardTitle) => {
  // Try exact match first
  if (imageMap[cardTitle]) {
    return imageMap[cardTitle];
  }
  
  // Try partial match
  const titleKey = Object.keys(imageMap).find(key => 
    cardTitle.includes(key) || key.includes(cardTitle)
  );
  
  return titleKey ? imageMap[titleKey] : placeholderImg;
};

const CardListComponent = () => {
  console.log('💳 CardList rendering');
  
  const toolOutput = useToolOutput();
  const [flippedCards, setFlippedCards] = useState({});
  const [cardDetails, setCardDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [showRewardsBenefits, setShowRewardsBenefits] = useState(null);
  const [showRatesFees, setShowRatesFees] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(null);
  
  console.log('📊 Tool output:', toolOutput);
  
  const fetchCardDetails = async (cardTitle, index) => {
    if (cardDetails[index]) {
      // Already loaded, just flip the card
      handleCardFlip(index);
      return;
    }
    
    console.log(`🔄 Fetching details for: ${cardTitle}`);
    setLoadingDetails(prev => ({ ...prev, [index]: true }));
    
    // Use ngrok URL for API calls
    const API_BASE_URL = 'https://075afded9b12.ngrok-free.app';
    
    try {
      // Fetch both reward benefits and rates & fees in parallel
      const [benefitsResponse, ratesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/fetch_reward_benefits?card_title=${encodeURIComponent(cardTitle)}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }),
        fetch(`${API_BASE_URL}/api/fetch_rates_and_fees?card_title=${encodeURIComponent(cardTitle)}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
      ]);
      
      const benefitsData = await benefitsResponse.json();
      const ratesData = await ratesResponse.json();
      
      console.log('📥 Benefits data:', benefitsData);
      console.log('💰 Rates & Fees data:', ratesData);
      
      // Extract the benefits data for this specific card
      let extractedBenefits = null;
      if (benefitsData.success && benefitsData.data) {
        const cardName = Object.keys(benefitsData.data)[0];
        if (cardName && benefitsData.data[cardName] && benefitsData.data[cardName].data) {
          extractedBenefits = benefitsData.data[cardName].data.data;
        }
      }
      
      // Extract rates and fees data
      let extractedRates = null;
      if (ratesData.success && ratesData.data && ratesData.data.length > 0) {
        extractedRates = ratesData.data[0].rates_and_fees;
      }
      
      setCardDetails(prev => ({
        ...prev,
        [index]: {
          benefits: extractedBenefits ? { success: true, data: extractedBenefits } : benefitsData,
          rates: extractedRates ? { success: true, data: extractedRates } : ratesData
        }
      }));
      
      // Flip the card after data is loaded
      handleCardFlip(index);
    } catch (error) {
      console.error('❌ Error fetching card details:', error);
      // Still flip the card even if fetch fails
      handleCardFlip(index);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [index]: false }));
    }
  };
  
  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // If no data yet, show shimmer loading state
  if (!toolOutput) {
    return (
      <Container>
        <ScrollContainer>
          {[1, 2, 3, 4].map((i) => (
            <ShimmerCard key={i}>
              <ShimmerImage />
              <ShimmerTitle />
              <ShimmerSubtitle />
              <ShimmerFeature />
              <ShimmerFeature />
            </ShimmerCard>
          ))}
        </ScrollContainer>
      </Container>
    );
  }

  // Handle both array and object with cards property
  const cards = Array.isArray(toolOutput) ? toolOutput : toolOutput.cards;

  if (!cards || cards.length === 0) {
    return (
      <Container>
        <EmptyState>No credit cards found</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollContainer>
        {cards.map((card, index) => {
          // Get the bundled image using card title
          const imageUrl = getCardImage(card.title);
          const isFlipped = flippedCards[index] || false;
          
          return (
            <CardContainer key={index}>
              <CardInner isFlipped={isFlipped}>
                {/* Front of card */}
                <CardFront>
                  <Card>
                    <CardImage 
                      src={imageUrl} 
                      alt={card.title}
                      onError={(e) => {
                        e.target.src = placeholderImg;
                        console.warn(`Failed to load image for: ${card.title}`);
                      }}
                    />
                    
                    <CategoryBadge category={card.category}>
                      {card.category}
                    </CategoryBadge>
                    
                    <CardTitle>{card.title}</CardTitle>
                    <CardSubtitle>{stripHtml(card.subtitle)}</CardSubtitle>
                    
                    {card.feature4_content && card.feature4_content[0] && (
                      <Feature>
                        <FeatureLabel>Intro Offer</FeatureLabel>
                        <FeatureValue>{stripHtml(card.feature4_content[0])}</FeatureValue>
                      </Feature>
                    )}
                    
                    {card.feature5_content && card.feature5_content[0] && (
                      <Feature>
                        <FeatureLabel>Rewards</FeatureLabel>
                        <FeatureValue>{stripHtml(card.feature5_content[0])}</FeatureValue>
                      </Feature>
                    )}
                    
                    {card.feature6_content && card.feature6_content[0] && (
                      <AnnualFee isFree={card.feature6_content[0] === '$0'}>
                        Annual Fee: {card.feature6_content[0]}
                      </AnnualFee>
                    )}
                    
                    <ViewDetailsButton onClick={() => setShowApplyModal(card)}>
                      Apply Now
                    </ViewDetailsButton>
                    
                    <LearnMoreButton 
                      onClick={() => fetchCardDetails(card.title, index)}
                      disabled={loadingDetails[index]}
                    >
                      {loadingDetails[index] ? 'Loading...' : 'Learn More'}
                    </LearnMoreButton>
                  </Card>
                </CardFront>
                
                {/* Back of card */}
                <CardBack>
                  <Card>
                    <BackTitle>{card.title}</BackTitle>
                    
                    <BackContent>
                      {/* Loading state */}
                      {loadingDetails[index] && !cardDetails[index] && (
                        <BackSection style={{ textAlign: 'center', padding: '40px 20px' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                          <BackText style={{ color: '#666' }}>Loading detailed information...</BackText>
                        </BackSection>
                      )}
                      
                      {/* Feature & Benefits Section */}
                      {cardDetails[index]?.benefits?.success && cardDetails[index]?.benefits?.data && (
                        <BackSection>
                          <BackLabel>🎁 FEATURE & BENEFITS</BackLabel>
                          <BackText style={{ marginBottom: '16px' }}>
                            View comprehensive feature and benefit terms for this card.
                          </BackText>
                          
                          {/* Feature List as Bullet Points */}
                          <ul style={{ 
                            margin: '16px 0',
                            paddingLeft: '20px',
                            listStyle: 'disc',
                            color: '#333'
                          }}>
                            {(() => {
                              const features = [];
                              const benefitsData = cardDetails[index].benefits.data;
                              for (let i = 1; i <= 9; i++) {
                                const titleKey = `feature${i}_title`;
                                const contentKey = `feature${i}_content`;
                                if (benefitsData[titleKey] && 
                                    benefitsData[contentKey] && 
                                    benefitsData[contentKey].length > 0) {
                                  features.push(
                                    <li key={i} style={{ 
                                      marginBottom: '8px',
                                      fontSize: '0.9rem',
                                      lineHeight: '1.4',
                                      color: '#555'
                                    }}>
                                      {stripHtml(benefitsData[titleKey])}
                                    </li>
                                  );
                                }
                              }
                              return features;
                            })()}
                          </ul>
                          
                          <button
                            onClick={() => setShowRewardsBenefits({
                              cardTitle: card.title,
                              data: cardDetails[index].benefits.data
                            })}
                            style={{ 
                              display: 'inline-block',
                              width: '100%',
                              padding: '12px 20px',
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              marginTop: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#b71c1c';
                              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#d32f2f';
                              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            View Full Rewards & Benefits →
                          </button>
                        </BackSection>
                      )}
                      
                      {/* Rates & Fees Section */}
                      {cardDetails[index]?.rates?.success && cardDetails[index]?.rates?.data && (
                        <BackSection>
                          <BackLabel>💰 RATES & FEES</BackLabel>
                          <BackText style={{ marginBottom: '16px' }}>
                            View comprehensive rate and fee information for this card.
                          </BackText>
                          
                          {/* Summary List as Bullet Points */}
                          <ul style={{ 
                            margin: '16px 0',
                            paddingLeft: '20px',
                            listStyle: 'disc',
                            color: '#333'
                          }}>
                            {(() => {
                              const ratesData = cardDetails[index].rates.data;
                              const items = [];
                              
                              // APR for Purchases
                              if (ratesData.interestRatesAndInterestCharges?.aprForPurchases) {
                                const apr = ratesData.interestRatesAndInterestCharges.aprForPurchases;
                                items.push(
                                  <li key="purchase-apr" style={{ 
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    color: '#555'
                                  }}>
                                    {apr.label || 'Purchase APR'}: {apr.introApr?.rate || ''} intro, then {apr.postIntroApr || 'Variable'}
                                  </li>
                                );
                              }
                              
                              // APR for Balance Transfers
                              if (ratesData.interestRatesAndInterestCharges?.aprForBalanceTransfers) {
                                const apr = ratesData.interestRatesAndInterestCharges.aprForBalanceTransfers;
                                items.push(
                                  <li key="bt-apr" style={{ 
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    color: '#555'
                                  }}>
                                    {apr.label || 'Balance Transfer APR'}: {apr.introApr?.rate || ''} intro, then {apr.postIntroApr || 'Variable'}
                                  </li>
                                );
                              }
                              
                              // Annual Fee
                              if (ratesData.fees?.annualFee) {
                                items.push(
                                  <li key="annual-fee" style={{ 
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    color: '#555'
                                  }}>
                                    {ratesData.fees.annualFee.label || 'Annual Fee'}: {ratesData.fees.annualFee.details || 'See details'}
                                  </li>
                                );
                              }
                              
                              // Balance Transfer Fee
                              if (ratesData.fees?.transactionFees?.balanceTransfers) {
                                items.push(
                                  <li key="bt-fee" style={{ 
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    color: '#555'
                                  }}>
                                    Balance Transfer Fee: {ratesData.fees.transactionFees.balanceTransfers.details || 'See details'}
                                  </li>
                                );
                              }
                              
                              // Foreign Transaction Fee
                              if (ratesData.fees?.transactionFees?.foreignTransaction) {
                                items.push(
                                  <li key="foreign-fee" style={{ 
                                    marginBottom: '8px',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    color: '#555'
                                  }}>
                                    Foreign Transaction Fee: {ratesData.fees.transactionFees.foreignTransaction.details || 'See details'}
                                  </li>
                                );
                              }
                              
                              return items;
                            })()}
                          </ul>
                          
                          <button
                            onClick={() => setShowRatesFees({
                              cardTitle: card.title,
                              data: cardDetails[index].rates.data
                            })}
                            style={{ 
                              display: 'inline-block',
                              width: '100%',
                              padding: '12px 20px',
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              marginTop: '12px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#b71c1c';
                              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = '#d32f2f';
                              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            View Full Rates & Fees →
                          </button>
                        </BackSection>
                      )}
                      
                      {/* Fallback to original data if no fetched details */}
                      {!cardDetails[index] && !loadingDetails[index] && (
                        <>
                          <BackSection>
                            <BackLabel>Card Category</BackLabel>
                            <BackText style={{ textTransform: 'capitalize' }}>{card.category}</BackText>
                          </BackSection>
                          
                          {card.subtitle && (
                            <BackSection>
                              <BackLabel>About This Card</BackLabel>
                              <BackText>{stripHtml(card.subtitle)}</BackText>
                            </BackSection>
                          )}
                          
                          {card.feature4_content && card.feature4_content[0] && (
                            <BackSection>
                              <BackLabel>🎁 Intro Offer</BackLabel>
                              <BackText>{stripHtml(card.feature4_content[0])}</BackText>
                            </BackSection>
                          )}
                          
                          {card.feature5_content && card.feature5_content[0] && (
                            <BackSection>
                              <BackLabel>💳 Rewards</BackLabel>
                              <BackText>{stripHtml(card.feature5_content[0])}</BackText>
                            </BackSection>
                          )}
                          
                          <BackSection>
                            <BackLabel>ℹ️ Note</BackLabel>
                            <BackText style={{ fontSize: '0.85rem', color: '#666' }}>
                              Click "Learn More" to load detailed terms and conditions from Wells Fargo.
                            </BackText>
                          </BackSection>
                        </>
                      )}
                      
                      {/* Error state */}
                      {cardDetails[index] && !loadingDetails[index] && 
                       (!cardDetails[index].benefits?.success) && (
                        <BackSection>
                          <BackLabel>⚠️ Unable to Load Details</BackLabel>
                          <BackText style={{ fontSize: '0.9rem', color: '#666' }}>
                            Some information could not be loaded from Wells Fargo. 
                            Please visit wellsfargo.com or contact Wells Fargo directly for complete details.
                          </BackText>
                        </BackSection>
                      )}
                    </BackContent>
                    
                    <BackButton onClick={() => handleCardFlip(index)}>
                      ← Back to Card
                    </BackButton>
                  </Card>
                </CardBack>
              </CardInner>
            </CardContainer>
          );
        })}
      </ScrollContainer>
      
      {/* Rewards & Benefits Modal */}
      {showRewardsBenefits && (
        <RewardsBenefits 
          data={showRewardsBenefits.data}
          cardTitle={showRewardsBenefits.cardTitle}
          onClose={() => setShowRewardsBenefits(null)}
        />
      )}
      
      {/* Rates & Fees Modal */}
      {showRatesFees && (
        <RatesFees 
          data={showRatesFees.data}
          cardTitle={showRatesFees.cardTitle}
          onClose={() => setShowRatesFees(null)}
        />
      )}
      
      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal 
          card={showApplyModal}
          onClose={() => setShowApplyModal(null)}
        />
      )}
    </Container>
  );
};

export default CardListComponent;

// Mount the component
console.log('🔍 Looking for mount point...');

// Keep a reference to the root to avoid creating multiple roots
let reactRoot = null;

function mountWidget() {
  // Try multiple mount points for flexibility
  const mountPoints = ['component-root', 'card-list-root'];
  let rootElement = null;
  
  for (const id of mountPoints) {
    rootElement = document.getElementById(id);
    if (rootElement) {
      console.log(`✅ Found mount point #${id}, rendering...`);
      
      // Only create root once, then reuse it
      if (!reactRoot) {
        reactRoot = createRoot(rootElement);
        console.log('🔧 Created new React root');
      }
      
      reactRoot.render(<CardListComponent />);
      console.log('🎉 Component mounted!');
      return;
    }
  }
  
  console.error('❌ No mount point found! Looking for:', mountPoints.join(', '));
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget);
} else {
  mountWidget();
}
