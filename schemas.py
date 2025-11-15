"""
Input validation schemas for Credit Card Finder MCP Server tools.
"""

from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field, ConfigDict
from service import CardCategory


class ListCardsInput(BaseModel):
    """Input schema for list_cards tool."""
    category: Literal["cashback", "travel", "introrate", "rewards", "all"] = Field(
        "all", 
        description="""Filter Wells Fargo credit cards by category. Choose the most relevant category based on user needs:

        - cashback: Cards that offer cash back rewards on purchases. Best for users who want simple, straightforward cash rewards on everyday spending. Includes cards like Active Cash® and Attune®.
        
        - travel: Cards designed for travelers with travel rewards, airline miles, hotel points, and travel-related benefits. Best for frequent travelers who want to earn points/miles on travel purchases. Includes cards like Autograph Journey℠, Autograph®, One Key™ Card, and Choice Privileges® cards.
        
        - introrate: Cards with introductory 0% APR periods on purchases and/or balance transfers. Best for users who need to make large purchases or transfer balances and want to save on interest. Includes cards like Reflect®, Active Cash®, Autograph®, and Attune®.
        
        - rewards: General rewards cards that offer flexible points or rewards on various purchases. Best for users who want versatile rewards programs that can be redeemed in multiple ways. Includes cards like Autograph Journey℠, Autograph®, Active Cash®, and One Key™ cards.
        
        - all: Returns all available credit cards from all categories (default). Use this when the user wants to browse all options or hasn't specified a preference.
        
        Note: Some cards may appear in multiple categories as they offer multiple benefits (e.g., a card might have both cashback rewards AND an intro 0% APR period).
        """
    )
    no_annual_fee: Optional[bool] = Field(
        None,
        description="""Filter cards by annual fee. 
        
        - true: Show only cards with $0 annual fee (no annual fee)
        - false: Show only cards that have an annual fee ($95, $99, etc.)
        - null/not provided: Show all cards regardless of annual fee
        
        Use this when users explicitly ask for "no annual fee", "free cards", "cards without annual fee", or "$0 annual fee" cards. 
        This helps users who want to avoid paying yearly maintenance fees on their credit cards.
        """
    )


class FetchRewardBenefitsInput(BaseModel):
    """Input schema for fetch_reward_benefits tool."""
    card_titles: List[Literal[
        "Active Cash",
        "Attune", 
        "Autograph",
        "Autograph Journey",
        "Choice Privileges Mastercard",
        "Choice Privileges Select Mastercard",
        "One Key Card",
        "One Key+ Card",
        "Reflect"
    ]] = Field(
        ...,
        description="""List of Wells Fargo credit card names to fetch reward benefits for. Each card name must be one of:
        
        - Active Cash: 2% unlimited cash rewards card
        - Attune: Card for making positive impact with rewards
        - Autograph: Travel rewards card with no annual fee
        - Autograph Journey: Premium travel rewards card with $95 annual fee
        - Choice Privileges Mastercard: Hotel rewards card (no annual fee)
        - Choice Privileges Select Mastercard: Premium hotel rewards card ($95 annual fee)
        - One Key Card: Travel rewards card for Expedia, Hotels.com, Vrbo (no annual fee)
        - One Key+ Card: Premium travel rewards card for Expedia, Hotels.com, Vrbo ($95 annual fee)
        - Reflect: Low intro APR card for balance transfers and purchases
        
        Use the exact card names as listed above without any special characters (®, ™, ℠).
        You can specify one or multiple cards. Examples:
        - ["Active Cash"]
        - ["Active Cash", "Autograph", "Reflect"]
        - ["Autograph Journey", "One Key+ Card"]
        """
    )


class FetchRatesAndFeesInput(BaseModel):
    """Input schema for fetch_rates_and_fees tool."""
    card_titles: List[Literal[
        "Active Cash",
        "Attune", 
        "Autograph",
        "Autograph Journey",
        "Choice Privileges Mastercard",
        "Choice Privileges Select Mastercard",
        "One Key Card",
        "One Key+ Card",
        "Reflect"
    ]] = Field(
        ...,
        description="""List of Wells Fargo credit card names to fetch rates and fees for. Each card name must be one of:
        
        - Active Cash: 2% unlimited cash rewards card
        - Attune: Card for making positive impact with rewards
        - Autograph: Travel rewards card with no annual fee
        - Autograph Journey: Premium travel rewards card with $95 annual fee
        - Choice Privileges Mastercard: Hotel rewards card (no annual fee)
        - Choice Privileges Select Mastercard: Premium hotel rewards card ($95 annual fee)
        - One Key Card: Travel rewards card for Expedia, Hotels.com, Vrbo (no annual fee)
        - One Key+ Card: Premium travel rewards card for Expedia, Hotels.com, Vrbo ($95 annual fee)
        - Reflect: Low intro APR card for balance transfers and purchases
        
        Use the exact card names as listed above without any special characters (®, ™, ℠).
        You can specify one or multiple cards to get their APR, annual fees, transaction fees, and penalty fees.
        Examples:
        - ["Active Cash"]
        - ["Active Cash", "Autograph", "Reflect"]
        - ["Autograph Journey", "One Key+ Card"]
        """
    )


class BenefitRow(BaseModel):
    """Schema for a benefit comparison row."""
    benefit_name: str = Field(
        ...,
        description="Name of the benefit category (e.g., 'Intro offer', 'Annual fee', 'Rewards rate', etc.)"
    )
    card_values: Dict[str, str] = Field(
        ...,
        description="Dictionary mapping card names to their benefit values for this category"
    )


class RecommendedCard(BaseModel):
    """Schema for recommended card."""
    card_name: str = Field(
        ...,
        description="Name of the recommended credit card"
    )


class CompareCardsOutput(BaseModel):
    """Output schema for compare cards response in table format."""
    cards: List[Literal[
        "Active Cash",
        "Attune", 
        "Autograph",
        "Autograph Journey",
        "Choice Privileges Mastercard",
        "Choice Privileges Select Mastercard",
        "One Key Card",
        "One Key+ Card",
        "Reflect"
    ]] = Field(
        ...,
        description="""List of Wells Fargo credit card names being compared. Each card name must be one of:
        
        - Active Cash: 2% unlimited cash rewards card
        - Attune: Card for making positive impact with rewards
        - Autograph: Travel rewards card with no annual fee
        - Autograph Journey: Premium travel rewards card with $95 annual fee
        - Choice Privileges Mastercard: Hotel rewards card (no annual fee)
        - Choice Privileges Select Mastercard: Premium hotel rewards card ($95 annual fee)
        - One Key Card: Travel rewards card for Expedia, Hotels.com, Vrbo (no annual fee)
        - One Key+ Card: Premium travel rewards card for Expedia, Hotels.com, Vrbo ($95 annual fee)
        - Reflect: Low intro APR card for balance transfers and purchases
        
        Use the exact card names as listed above without any special characters (®, ™, ℠).
        You can specify one or multiple cards. Examples:
        - ["Active Cash"]
        - ["Active Cash", "Autograph", "Reflect"]
        - ["Autograph Journey", "One Key+ Card"]
        """
    )
    benefit_rows: List[BenefitRow] = Field(
        ...,
        description="List of benefit rows, where each row contains a benefit category and values for each card"
    )
    recommended_card: RecommendedCard = Field(
        ...,
        description="The recommended card based on comparison"
    )


# Generate JSON schemas for all input models
def get_schemas() -> Dict[str, Dict[str, Any]]:
    """Get all tool input schemas as JSON."""
    return {
        "list_cards": ListCardsInput.model_json_schema(),
        "fetch_reward_benefits": FetchRewardBenefitsInput.model_json_schema(),
        "fetch_rates_and_fees": FetchRatesAndFeesInput.model_json_schema(),
        "compare_cards": CompareCardsOutput.model_json_schema()
    }
