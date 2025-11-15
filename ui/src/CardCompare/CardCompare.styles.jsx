import styled, { keyframes } from 'styled-components';

export const CompareContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  padding: 32px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const CompareHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const CompareTitle = styled.h1`
  color: white;
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TableContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

export const TableHeader = styled.thead`
  background: #D71E28;
`;

export const TableHeaderRow = styled.tr`
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`;

export const TableHeaderCell = styled.th`
  padding: 12px 12px;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  vertical-align: middle;
  
  &:first-child {
    text-align: left;
    font-size: 14px;
    width: 180px;
    min-width: 180px;
  }

  ${props => props.isRecommended && `
    background: #D71E28;
    position: relative;
    
    &::after {
      content: '⭐ Recommended';
      display: block;
      font-size: 9px;
      margin-top: 3px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
  `}
`;

export const CardHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const CardImage = styled.img`
  width: 60px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 2px;
`;

export const CardName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
  max-width: 140px;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(215, 30, 40, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const BenefitCell = styled.td`
  padding: 14px 12px;
  vertical-align: top;
  
  &:first-child {
    font-weight: 600;
    color: #D71E28;
    font-size: 12px;
    background-color: #fef2f2;
    border-right: 2px solid #e5e7eb;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 180px;
    min-width: 180px;
  }
`;

export const ValueCell = styled.td`
  padding: 14px 12px;
  vertical-align: top;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  text-align: left;
  
  ${props => props.isRecommended && `
    background-color: rgba(215, 30, 40, 0.05);
    font-weight: 500;
  `}
`;

export const RecommendedBadge = styled.div`
  background: #D71E28;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(215, 30, 40, 0.3);
`;

export const RecommendedSection = styled.div`
  max-width: 600px;
  margin: 40px auto 0;
`;

export const RecommendedCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(215, 30, 40, 0.3);
  border: 3px solid #D71E28;
`;

export const RecommendedTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1a237e;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const RecommendedCardName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #D71E28;
  margin: 0;
`;

export const ErrorMessage = styled.div`
  background: white;
  color: #d32f2f;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: white;
  font-size: 20px;
  font-weight: 500;

  &::before {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto 20px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

// Remove unused exports
export const CardsContainer = styled.div``;
export const CardColumn = styled.div``;
export const CardHeader = styled.div``;
export const BenefitsSection = styled.div``;
export const BenefitRow = styled.div``;
export const BenefitLabel = styled.div``;
export const BenefitValue = styled.div``;
