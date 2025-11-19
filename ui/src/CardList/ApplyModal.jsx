import React, { useEffect } from 'react';
import ApplicationForm from './ApplicationForm.jsx';

// Import card images for ApplicationForm
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

// Map card titles to images
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

const getCardImage = (cardTitle) => {
  if (imageMap[cardTitle]) {
    return imageMap[cardTitle];
  }
  const titleKey = Object.keys(imageMap).find(key => 
    cardTitle.includes(key) || key.includes(cardTitle)
  );
  return titleKey ? imageMap[titleKey] : placeholderImg;
};

const ApplyModal = ({ card, onClose }) => {
  useEffect(() => {
    // Request fullscreen display mode when modal loads
    // const requestDisplayMode = async () => {
    //   try {
    //     await window.openai?.requestDisplayMode({ mode: "fullscreen" });
    //     console.log('✅ Display mode set to fullscreen');
    //   } catch (error) {
    //     console.error('❌ Failed to set display mode:', error);
    //   }
    // };
    
    // requestDisplayMode();
  }, []);

  const cardImage = getCardImage(card.title);

  return (
    <ApplicationForm 
      card={card} 
      onClose={onClose} 
      cardImage={cardImage}
    />
  );
};

export default ApplyModal;
