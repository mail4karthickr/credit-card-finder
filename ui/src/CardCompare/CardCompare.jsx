import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useToolOutput } from '../hooks.js';
import ApplyModal from '../CardList/ApplyModal.jsx';
import {
  CompareContainer,
  CompareHeader,
  CompareTitle,
  TableContainer,
  ComparisonTable,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  CardHeaderContent,
  CardImage,
  CardName,
  TableBody,
  TableRow,
  BenefitCell,
  ValueCell,
  RecommendedBadge,
  ApplyButton,
  ErrorMessage,
  LoadingSpinner,
  ShimmerTable,
  ShimmerHeader,
  ShimmerHeaderCell,
  ShimmerRow,
  ShimmerCell,
} from './CardCompare.styles.jsx';

// Import card images
import activeCashImg from '../CardList/images/WF_ActiveCash_VS_Collateral_Front_RGB_714x450.png';
import attuneImg from '../CardList/images/WF_Attune_Front_RGB_714x450.png';
import autographImg from '../CardList/images/WF_Autograph_NoFee_VisaSignature_Front_Optimized_RGB.png';
import autographJourneyImg from '../CardList/images/Autograph_Journey_No_Flag.png';
import choiceFeeImg from '../CardList/images/WF_Choice_Fee_Front_Optimized_RGB.png';
import choiceNoFeeImg from '../CardList/images/WF_Choice_NoFee_Front_Optimized_RGB.png';
import oneKeyFeeImg from '../CardList/images/EP_OneKey_Fee_Front_Optimized_RGB.png';
import oneKeyNoFeeImg from '../CardList/images/EP_OneKey_NoFee_Front_Optimized_RGB.png';
import reflectImg from '../CardList/images/WF_Reflect_Front_Optimized_RGB.png';
import placeholderImg from '../CardList/images/placeholder.svg';

const imageMap = {
  'Active Cash': activeCashImg,
  'Attune': attuneImg,
  'Autograph': autographImg,
  'Autograph Journey': autographJourneyImg,
  'Choice Privileges Mastercard': choiceNoFeeImg,
  'Choice Privileges Select Mastercard': choiceFeeImg,
  'One Key Card': oneKeyNoFeeImg,
  'One Key+ Card': oneKeyFeeImg,
  'Reflect': reflectImg,
};

const getCardImage = (cardName) => {
  // Try exact match first
  if (imageMap[cardName]) {
    return imageMap[cardName];
  }
  
  // Try partial match
  const titleKey = Object.keys(imageMap).find(key => 
    cardName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(cardName.toLowerCase())
  );
  
  return titleKey ? imageMap[titleKey] : placeholderImg;
};

const CardCompareComponent = () => {
  console.log('🎨 [CardCompare] Component rendering');
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const toolOutput = useToolOutput();
  console.log('📤 [CardCompare] Tool output:', toolOutput);

  const handleApplyClick = (cardName) => {
    console.log('🔘 [CardCompare] Apply button clicked for:', cardName);
    const imageUrl = getCardImage(cardName);
    setSelectedCard({
      title: cardName,
      imageUrl: imageUrl
    });
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    console.log('❌ [CardCompare] Closing apply modal');
    setShowApplyModal(false);
    setSelectedCard(null);
  };

  if (!toolOutput) {
    console.log('⏳ [CardCompare] No tool output, showing shimmer skeleton');
    return (
      <CompareContainer>
        <ShimmerTable>
          <ShimmerHeader>
            <ShimmerHeaderCell />
            <ShimmerHeaderCell />
            <ShimmerHeaderCell />
            <ShimmerHeaderCell />
          </ShimmerHeader>
          {[1, 2, 3].map((i) => (
            <ShimmerRow key={i}>
              <ShimmerCell />
              <ShimmerCell />
              <ShimmerCell />
              <ShimmerCell />
            </ShimmerRow>
          ))}
        </ShimmerTable>
      </CompareContainer>
    );
  }

  const { cards = [], benefit_rows = [], recommended_card } = toolOutput;
  
  if (cards.length === 0) {
    console.log('⚠️ [CardCompare] No cards to compare');
    return (
      <CompareContainer>
        <ErrorMessage>No cards to compare</ErrorMessage>
      </CompareContainer>
    );
  }

  console.log(`📊 [CardCompare] Comparing ${cards.length} cards with ${benefit_rows.length} benefit rows`);

  return (
    <CompareContainer>
      <CompareHeader>
        <CompareTitle>Credit Card Comparison</CompareTitle>
      </CompareHeader>

      <TableContainer>
        <ComparisonTable>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Card</TableHeaderCell>
              {benefit_rows.map((row, index) => {
                const isAnnualFee = row.benefit_name.toLowerCase().includes('annual fee');
                return (
                  <TableHeaderCell key={index} isAnnualFee={isAnnualFee}>
                    {row.benefit_name}
                  </TableHeaderCell>
                );
              })}
            </TableHeaderRow>
          </TableHeader>
          
          <TableBody>
            {cards.map((cardName, cardIndex) => {
              const isRecommended = recommended_card?.card_name === cardName;
              const imageUrl = getCardImage(cardName);
              
              return (
                <TableRow key={cardIndex} isRecommended={isRecommended}>
                  <BenefitCell>
                    <CardHeaderContent>
                      <CardImage src={imageUrl} alt={cardName} />
                      <CardName>{cardName}</CardName>
                      {isRecommended && (
                        <>
                          <RecommendedBadge>⭐ Recommended</RecommendedBadge>
                          <ApplyButton onClick={() => handleApplyClick(cardName)}>
                            Apply Now
                          </ApplyButton>
                        </>
                      )}
                    </CardHeaderContent>
                  </BenefitCell>
                  {benefit_rows.map((row, rowIndex) => {
                    const isAnnualFee = row.benefit_name.toLowerCase().includes('annual fee');
                    return (
                      <ValueCell key={rowIndex} isRecommended={isRecommended} isAnnualFee={isAnnualFee}>
                        {row.card_values[cardName] || 'N/A'}
                      </ValueCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </ComparisonTable>
      </TableContainer>
      
      {showApplyModal && selectedCard && (
        <ApplyModal card={selectedCard} onClose={handleCloseModal} />
      )}
    </CompareContainer>
  );
};

export default CardCompareComponent;

// Widget mounting logic
function mountWidget() {
  console.log('🚀 [CardCompare] Mounting widget...');
  const rootElement = document.getElementById('card-compare-root');
  
  if (!rootElement) {
    console.error('❌ [CardCompare] Root element #card-compare-root not found!');
    return;
  }

  console.log('✅ [CardCompare] Root element found, creating React root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(<CardCompareComponent />);
  console.log('🎉 [CardCompare] Widget mounted successfully');
}

// Auto-mount when DOM is ready
if (document.readyState === 'loading') {
  console.log('⏳ [CardCompare] DOM still loading, waiting...');
  document.addEventListener('DOMContentLoaded', mountWidget);
} else {
  console.log('✅ [CardCompare] DOM ready, mounting immediately');
  mountWidget();
}
