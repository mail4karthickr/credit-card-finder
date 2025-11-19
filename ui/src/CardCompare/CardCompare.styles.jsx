import styled, { keyframes } from 'styled-components';

export const CompareContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: transparent;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const CompareHeader = styled.div`
  display: none;
`;

export const CompareTitle = styled.h1`
  display: none;
`;

export const TableContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0 0 16px 16px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D71E28;
    border-radius: 5px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #b01820;
  }
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  position: relative;
  z-index: 2;
  
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
  padding: 16px 12px;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  vertical-align: middle;
  min-width: 140px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  background: #D71E28;
  
  &:last-child {
    border-right: none;
  }
  
  &:first-child {
    text-align: center;
    font-size: 14px;
    width: 140px;
    min-width: 140px;
    position: sticky;
    left: 0;
    z-index: 50;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    background: #D71E28;
  }

  ${props => props.isAnnualFee && `
    min-width: 80px;
    width: 80px;
    max-width: 80px;
  `}

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
  gap: 8px;
  justify-content: center;
`;

export const CardImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: white;
  padding: 4px;
`;

export const CardName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #1a237e;
  text-align: center;
  line-height: 1.3;
  max-width: 120px;
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

  ${props => props.isRecommended && `
    background-color: #fff5f5;
    border-left: 4px solid #D71E28;
    
    &:hover {
      background-color: #ffebeb;
    }
    
    td:first-child {
      background-color: #fff5f5 !important;
    }
  `}
`;

export const BenefitCell = styled.td`
  padding: 20px 16px;
  vertical-align: middle;
  border-right: 1px solid #e5e7eb;
  background: white;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-right: none;
  }
  
  &:first-child {
    font-weight: 600;
    color: #1a237e;
    font-size: 14px;
    background-color: #f8f9fa;
    border-right: 1px solid #e5e7eb;
    width: 140px;
    min-width: 140px;
    position: sticky;
    left: 0;
    z-index: 40;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  }
`;

export const ValueCell = styled.td`
  padding: 20px 14px;
  vertical-align: middle;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  text-align: left;
  min-width: 140px;
  border-right: 1px solid #e5e7eb;
  background: white;
  
  &:last-child {
    border-right: none;
  }
  
  ${props => props.isAnnualFee && `
    min-width: 80px;
    width: 80px;
    max-width: 80px;
    text-align: center;
  `}
  
  ${props => props.isRecommended && `
    font-weight: 500;
    background-color: #fff5f5;
  `}
`;

export const RecommendedBadge = styled.div`
  background: #D71E28;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 700;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(215, 30, 40, 0.3);
  white-space: nowrap;
  margin-top: 4px;
`;

export const ApplyButton = styled.button`
  background: #D71E28;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(215, 30, 40, 0.4);
  margin-top: 8px;
  width: 100%;
  max-width: 140px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(215, 30, 40, 0.5);
    background: #b71c1c;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(215, 30, 40, 0.4);
  }
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
  color: #374151;
  font-size: 18px;
  font-weight: 500;

  &::before {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto 20px;
    border: 4px solid rgba(215, 30, 40, 0.2);
    border-top-color: #D71E28;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

// Shimmer loading skeleton components
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const ShimmerTable = styled.div`
  width: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const ShimmerHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  padding: 16px;
  gap: 12px;
`;

export const ShimmerHeaderCell = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  height: 80px;
  border-radius: 8px;
  
  &:first-child {
    width: 140px;
    flex-shrink: 0;
  }
  
  flex: 1;
  min-width: 140px;
`;

export const ShimmerRow = styled.div`
  display: flex;
  padding: 20px 16px;
  border-bottom: 1px solid #e5e7eb;
  gap: 12px;
  align-items: center;
`;

export const ShimmerCell = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  height: 60px;
  border-radius: 6px;
  
  &:first-child {
    width: 140px;
    flex-shrink: 0;
  }
  
  flex: 1;
  min-width: 140px;
`;

// Remove unused exports
export const CardsContainer = styled.div``;
export const CardColumn = styled.div``;
export const CardHeader = styled.div``;
export const BenefitsSection = styled.div``;
export const BenefitRow = styled.div``;
export const BenefitLabel = styled.div``;
export const BenefitValue = styled.div``;
