import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  font-weight: 700;
`;

const Subtitle = styled.div`
  font-size: 1rem;
  opacity: 0.95;
  font-weight: 500;
`;

const CloseButton = styled.button`
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
  margin-left: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #d32f2f;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f5f5f5;
`;

const InfoBox = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #d32f2f;
  padding: 16px 20px;
  margin-bottom: 16px;
  border-radius: 4px;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
`;

const SubSection = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SubSectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
`;

const DetailsText = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RatesFees = ({ data, cardTitle, onClose }) => {
  console.log('💰 RatesFees modal data:', data);
  
  const ratesData = data || {};
  const interestRates = ratesData.interestRatesAndInterestCharges || {};
  const fees = ratesData.fees || {};
  const productInfo = ratesData.productInfo || {};

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <Title>Rates & Fees</Title>
            <Subtitle>{cardTitle}</Subtitle>
          </HeaderContent>
          <CloseButton onClick={onClose} aria-label="Close">
            ×
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {/* Product Information */}
          {productInfo.primaryTitle && (
            <Section>
              <SectionTitle>📋 Product Information</SectionTitle>
              <InfoBox>
                <InfoLabel>{productInfo.primaryTitle}</InfoLabel>
                {productInfo.description && (
                  <InfoValue>{productInfo.description}</InfoValue>
                )}
                {productInfo.introBonusEligibility && (
                  <DetailsText style={{ marginTop: '12px', fontStyle: 'italic' }}>
                    {productInfo.introBonusEligibility}
                  </DetailsText>
                )}
              </InfoBox>
            </Section>
          )}

          {/* Interest Rates Section */}
          {Object.keys(interestRates).length > 0 && (
            <Section>
              <SectionTitle>📊 Interest Rates and Interest Charges</SectionTitle>
              
              {/* APR for Purchases */}
              {interestRates.aprForPurchases && (
                <SubSection>
                  <SubSectionTitle>{interestRates.aprForPurchases.label || 'APR for Purchases'}</SubSectionTitle>
                  {interestRates.aprForPurchases.introApr && (
                    <InfoBox>
                      <InfoLabel>Introductory APR</InfoLabel>
                      <InfoValue>
                        {interestRates.aprForPurchases.introApr.rate} - {interestRates.aprForPurchases.introApr.duration}
                      </InfoValue>
                    </InfoBox>
                  )}
                  {interestRates.aprForPurchases.postIntroApr && (
                    <InfoBox>
                      <InfoLabel>Regular APR</InfoLabel>
                      <InfoValue>{interestRates.aprForPurchases.postIntroApr}</InfoValue>
                      {interestRates.aprForPurchases.basedOn && (
                        <DetailsText style={{ marginTop: '8px' }}>{interestRates.aprForPurchases.basedOn}</DetailsText>
                      )}
                      {interestRates.aprForPurchases.variableInfo && (
                        <DetailsText style={{ marginTop: '4px', fontSize: '0.85rem' }}>
                          {interestRates.aprForPurchases.variableInfo}
                        </DetailsText>
                      )}
                    </InfoBox>
                  )}
                </SubSection>
              )}

              {/* APR for Balance Transfers */}
              {interestRates.aprForBalanceTransfers && (
                <SubSection>
                  <SubSectionTitle>{interestRates.aprForBalanceTransfers.label || 'APR for Balance Transfers'}</SubSectionTitle>
                  {interestRates.aprForBalanceTransfers.introApr && (
                    <InfoBox>
                      <InfoLabel>Introductory APR</InfoLabel>
                      <InfoValue>
                        {interestRates.aprForBalanceTransfers.introApr.rate} - {interestRates.aprForBalanceTransfers.introApr.duration}
                      </InfoValue>
                    </InfoBox>
                  )}
                  {interestRates.aprForBalanceTransfers.postIntroApr && (
                    <InfoBox>
                      <InfoLabel>Regular APR</InfoLabel>
                      <InfoValue>{interestRates.aprForBalanceTransfers.postIntroApr}</InfoValue>
                      {interestRates.aprForBalanceTransfers.basedOn && (
                        <DetailsText style={{ marginTop: '8px' }}>{interestRates.aprForBalanceTransfers.basedOn}</DetailsText>
                      )}
                      {interestRates.aprForBalanceTransfers.variableInfo && (
                        <DetailsText style={{ marginTop: '4px', fontSize: '0.85rem' }}>
                          {interestRates.aprForBalanceTransfers.variableInfo}
                        </DetailsText>
                      )}
                    </InfoBox>
                  )}
                </SubSection>
              )}

              {/* APR for Cash Advances */}
              {interestRates.aprForCashAdvancesAndOverdraftProtection && (
                <SubSection>
                  <SubSectionTitle>{interestRates.aprForCashAdvancesAndOverdraftProtection.label || 'APR for Cash Advances'}</SubSectionTitle>
                  <InfoBox>
                    <InfoValue>{interestRates.aprForCashAdvancesAndOverdraftProtection.rate}</InfoValue>
                    {interestRates.aprForCashAdvancesAndOverdraftProtection.variableInfo && (
                      <DetailsText style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                        {interestRates.aprForCashAdvancesAndOverdraftProtection.variableInfo}
                      </DetailsText>
                    )}
                  </InfoBox>
                </SubSection>
              )}

              {/* How to Avoid Interest */}
              {interestRates.howToAvoidPayingInterestOnPurchases && (
                <SubSection>
                  <SubSectionTitle>{interestRates.howToAvoidPayingInterestOnPurchases.label || 'How to Avoid Paying Interest on Purchases'}</SubSectionTitle>
                  <InfoBox>
                    <InfoValue>{interestRates.howToAvoidPayingInterestOnPurchases.details}</InfoValue>
                  </InfoBox>
                </SubSection>
              )}

              {/* Minimum Interest Charge */}
              {interestRates.minimumInterestCharge && (
                <SubSection>
                  <SubSectionTitle>{interestRates.minimumInterestCharge.label || 'Minimum Interest Charge'}</SubSectionTitle>
                  <InfoBox>
                    <InfoValue>{interestRates.minimumInterestCharge.details}</InfoValue>
                  </InfoBox>
                </SubSection>
              )}
            </Section>
          )}

          {/* Fees Section */}
          {Object.keys(fees).length > 0 && (
            <Section>
              <SectionTitle>💳 Fees</SectionTitle>
              
              {/* Annual Fee */}
              {fees.annualFee && (
                <InfoBox>
                  <InfoLabel>{fees.annualFee.label || 'Annual Fee'}</InfoLabel>
                  <InfoValue>{fees.annualFee.details}</InfoValue>
                </InfoBox>
              )}

              {/* Transaction Fees */}
              {fees.transactionFees && (
                <SubSection>
                  <SubSectionTitle>{fees.transactionFees.label || 'Transaction Fees'}</SubSectionTitle>
                  
                  {fees.transactionFees.balanceTransfers && (
                    <InfoBox>
                      <InfoLabel>{fees.transactionFees.balanceTransfers.label || 'Balance Transfers'}</InfoLabel>
                      <InfoValue>{fees.transactionFees.balanceTransfers.details}</InfoValue>
                    </InfoBox>
                  )}
                  
                  {fees.transactionFees.cashAdvances && (
                    <InfoBox>
                      <InfoLabel>{fees.transactionFees.cashAdvances.label || 'Cash Advances'}</InfoLabel>
                      <InfoValue>{fees.transactionFees.cashAdvances.details}</InfoValue>
                    </InfoBox>
                  )}
                  
                  {fees.transactionFees.foreignTransaction && (
                    <InfoBox>
                      <InfoLabel>{fees.transactionFees.foreignTransaction.label || 'Foreign Transaction'}</InfoLabel>
                      <InfoValue>{fees.transactionFees.foreignTransaction.details}</InfoValue>
                    </InfoBox>
                  )}
                </SubSection>
              )}

              {/* Penalty Fees */}
              {fees.penaltyFees && (
                <SubSection>
                  <SubSectionTitle>{fees.penaltyFees.label || 'Penalty Fees'}</SubSectionTitle>
                  
                  {fees.penaltyFees.latePayment && (
                    <InfoBox>
                      <InfoLabel>{fees.penaltyFees.latePayment.label || 'Late Payment'}</InfoLabel>
                      <InfoValue>{fees.penaltyFees.latePayment.details}</InfoValue>
                    </InfoBox>
                  )}
                </SubSection>
              )}
            </Section>
          )}

          {/* CFPB Tips */}
          {interestRates.cfpbTips && (
            <Section>
              <InfoBox style={{ borderLeftColor: '#1976d2', background: '#e3f2fd' }}>
                <InfoLabel>{interestRates.cfpbTips.label || 'Consumer Financial Protection Bureau'}</InfoLabel>
                <InfoValue>{interestRates.cfpbTips.details}</InfoValue>
              </InfoBox>
            </Section>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RatesFees;
