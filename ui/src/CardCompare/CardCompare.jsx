import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useToolOutput } from '../hooks.js';
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
  ErrorMessage,
  LoadingSpinner
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
  
  const toolOutput = useToolOutput();
  console.log('📤 [CardCompare] Tool output:', toolOutput);

  if (!toolOutput) {
    console.log('⏳ [CardCompare] No tool output, showing loading spinner');
    return (
      <CompareContainer>
        <LoadingSpinner>Loading comparison...</LoadingSpinner>
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
              <TableHeaderCell>Benefits</TableHeaderCell>
              {cards.map((cardName, index) => {
                const isRecommended = recommended_card?.card_name === cardName;
                const imageUrl = getCardImage(cardName);
                
                return (
                  <TableHeaderCell key={index} isRecommended={isRecommended}>
                    <CardHeaderContent>
                      <CardImage src={imageUrl} alt={cardName} />
                      <CardName>{cardName}</CardName>
                    </CardHeaderContent>
                  </TableHeaderCell>
                );
              })}
            </TableHeaderRow>
          </TableHeader>
          
          <TableBody>
            {benefit_rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <BenefitCell>{row.benefit_name}</BenefitCell>
                {cards.map((cardName, cardIndex) => {
                  const isRecommended = recommended_card?.card_name === cardName;
                  return (
                    <ValueCell key={cardIndex} isRecommended={isRecommended}>
                      {row.card_values[cardName] || 'N/A'}
                    </ValueCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </ComparisonTable>
      </TableContainer>
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
