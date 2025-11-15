import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #555;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
};

const CardDetail = ({ card }) => {
  if (!card) {
    return <Container>No card selected</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>{card.title}</Title>
        <Subtitle>{stripHtml(card.subtitle)}</Subtitle>
      </Header>

      {card.feature4_content && card.feature4_content[0] && (
        <Section>
          <SectionTitle>{card.feature4_title || 'Intro Offer'}</SectionTitle>
          <Content>{stripHtml(card.feature4_content[0])}</Content>
        </Section>
      )}

      {card.feature5_content && card.feature5_content[0] && (
        <Section>
          <SectionTitle>{card.feature5_title || 'Rewards'}</SectionTitle>
          <Content>{stripHtml(card.feature5_content[0])}</Content>
        </Section>
      )}

      {card.feature6_content && card.feature6_content[0] && (
        <Section>
          <SectionTitle>{card.feature6_title || 'Annual Fee'}</SectionTitle>
          <Content>{card.feature6_content[0]}</Content>
        </Section>
      )}
    </Container>
  );
};

export default CardDetail;
