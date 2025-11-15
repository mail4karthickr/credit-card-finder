"""
Business logic layer for Credit Card Finder MCP Server.
Contains all service functions that interact with data.
"""

import json
import logging
import re
import requests
from typing import List, Dict, Any, Optional
from enum import Enum

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CardCategory(str, Enum):
    """Valid credit card categories."""
    CASHBACK = "cashback"
    TRAVEL = "travel"
    INTRORATE = "introrate"
    REWARDS = "rewards"
    ALL = "all"


# Card metadata mapping
CARD_METADATA = {
    "Active Cash": {
        "code": "AC",
        "feature_benefit_terms_url": "/as/getFootnotes?key=AC_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_ActiveCash_VS_Collateral_Front_RGB_714x450.png"
    },
    "Attune": {
        "code": "EM",
        "feature_benefit_terms_url": "/as/getFootnotes?key=EM_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_Attune_Front_RGB_714x450.png"
    },
    "Autograph": {
        "code": "AU",
        "feature_benefit_terms_url": "/as/getFootnotes?key=AU_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_Autograph_NoFee_VisaSignature_Front_Optimized_RGB.png"
    },
    "Autograph Journey": {
        "code": "MT",
        "feature_benefit_terms_url": "/as/getFootnotes?key=MT_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/Autograph_Journey_No_Flag.png"
    },
    "Choice Privileges Mastercard": {
        "code": "CP",
        "feature_benefit_terms_url": "/as/getFootnotes?key=CP_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_Choice_NoFee_Front_Optimized_RGB.png"
    },
    "Choice Privileges Select Mastercard": {
        "code": "CE",
        "feature_benefit_terms_url": "/as/getFootnotes?key=CE_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_Choice_Fee_Front_Optimized_RGB.png"
    },
    "One Key Card": {
        "code": "OW",
        "feature_benefit_terms_url": "/as/getFootnotes?key=OW_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/EP_OneKey_NoFee_Front_Optimized_RGB.png"
    },
    "One Key+ Card": {
        "code": "OF",
        "feature_benefit_terms_url": "/as/getFootnotes?key=OF_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/EP_OneKey_Fee_Front_Optimized_RGB.png"
    },
    "Reflect": {
        "code": "VV",
        "feature_benefit_terms_url": "/as/getFootnotes?key=VV_benefitTerms&appCode=CCPP",
        "card_image": "/assets/images/photography/product/credit-cards/WF_Reflect_Front_Optimized_RGB.png"
    }
}

CARD_CODE_TO_TITLE = {v["code"]: k for k, v in CARD_METADATA.items()}

# Base URL for Wells Fargo
BASE_URL = "https://web.secure.wellsfargo.com"


def _get_card_metadata(card_title: str) -> Optional[dict]:
    """
    Get complete metadata for a card given its title.
    Handles titles with HTML tags and superscript characters (®, ™, ℠).
    
    Args:
        card_title: The card title (may include HTML tags and superscripts)
        
    Returns:
        Dictionary with keys: code, feature_benefit_terms_url, card_image
        or None if not found
    """
    clean_title = re.sub(r'<[^>]+>', '', card_title)
    clean_title = re.sub(r'[®™℠]', '', clean_title).strip()
    return CARD_METADATA.get(clean_title)


def _get_card_feature_benefit_url(card_title: str) -> Optional[str]:
    """
    Get the feature and benefit terms URL for a card.
    
    Args:
        card_title: The card title
        
    Returns:
        Feature and benefit terms URL or None if not found
    """
    metadata = _get_card_metadata(card_title)
    return metadata["feature_benefit_terms_url"] if metadata else None


def get_card_image(card_title: str) -> Optional[str]:
    """
    Get the card image path for a card.
    
    Args:
        card_title: The card title
        
    Returns:
        Card image path or None if not found
    """
    metadata = _get_card_metadata(card_title)
    return metadata["card_image"] if metadata else None


def fetch_reward_benefits(card_titles: List[str]) -> Dict[str, Any]:
    """
    Fetch reward benefits and terms for one or more credit cards from Wells Fargo.
    
    Args:
        card_titles: List of card titles (e.g., ["Active Cash", "Autograph®", "Reflect"])
        
    Returns:
        Dictionary containing:
        - success (bool): Whether all requests were successful
        - data (dict): Dictionary mapping card titles to their benefit data
        - errors (dict): Dictionary mapping card titles to error messages (if any)
        - count (int): Number of cards processed
        
    Example:
        result = fetch_reward_benefits(["Active Cash®", "Reflect®"])
        if result['success']:
            for card, benefits in result['data'].items():
                print(f"{card}: {benefits}")
    """
    logger.info(f"🎁 Fetching reward benefits for {len(card_titles)} card(s): {card_titles}")
    
    results = {}
    errors = {}
    
    for card_title in card_titles:
        logger.info(f"  Processing: {card_title}")
        
        # Get the feature and benefit terms URL from metadata
        rewards_path = _get_card_feature_benefit_url(card_title)
        
        if not rewards_path:
            error_msg = f"No feature and benefit terms URL found for card: {card_title}"
            logger.error(f"  ❌ {error_msg}")
            errors[card_title] = error_msg
            continue
        
        # Construct full URL
        full_url = f"{BASE_URL}{rewards_path}"
        logger.debug(f"  Requesting: {full_url}")
        
        try:
            # Make HTTP GET request
            response = requests.get(full_url, timeout=10)
            response.raise_for_status()
            
            logger.info(f"  ✅ Successfully fetched reward benefits for {card_title}")
            
            # Try to parse as JSON, fallback to text
            try:
                data = response.json()
            except ValueError:
                data = response.text
            
            results[card_title] = {
                "data": data,
                "url": full_url
            }
            
        except requests.exceptions.Timeout:
            error_msg = f"Request timeout while fetching reward benefits"
            logger.error(f"  ❌ {error_msg}")
            errors[card_title] = error_msg
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Error fetching reward benefits: {str(e)}"
            logger.error(f"  ❌ {error_msg}")
            errors[card_title] = error_msg
    
    # Determine overall success
    success = len(results) > 0 and len(errors) == 0
    
    logger.info(f"✅ Completed fetching benefits: {len(results)} successful, {len(errors)} failed")
    
    return {
        "success": success,
        "data": results,
        "errors": errors if errors else None,
        "count": len(card_titles),
        "successful": len(results),
        "failed": len(errors)
    }


def fetch_rates_and_fees(card_titles: List[str]) -> Dict[str, Any]:
    """
    Fetch rates and fees information for one or more credit cards from local JSON files.
    
    Args:
        card_titles: List of card titles (e.g., ["Active Cash", "Autograph"])
        
    Returns:
        Dictionary with success status, data, and errors
    """
    logger.info(f"💰 Fetching rates and fees for {len(card_titles)} card(s): {card_titles}")
    
    results = []
    errors = []
    
    for card_title in card_titles:
        # Clean the card title and convert to filename format
        clean_title = re.sub(r'<[^>]+>', '', card_title)
        clean_title = re.sub(r'[®™℠]', '', clean_title).strip()
        
        # Convert card title to filename (e.g., "Active Cash" -> "active_cash.json")
        filename = clean_title.lower().replace(' ', '_') + '.json'
        filepath = f'json/rates_and_fees/{filename}'
        
        logger.debug(f"Looking for file: {filepath}")
        
        try:
            with open(filepath, 'r') as f:
                rates_data = json.load(f)
            
            results.append({
                "card_title": card_title,
                "rates_and_fees": rates_data
            })
            logger.info(f"✅ Successfully loaded rates and fees for '{card_title}'")
            
        except FileNotFoundError:
            error_msg = f"Rates and fees file not found for card '{card_title}' (looked for: {filepath})"
            logger.error(f"❌ {error_msg}")
            errors.append({
                "card_title": card_title,
                "error": error_msg
            })
        except json.JSONDecodeError as e:
            error_msg = f"Invalid JSON in rates and fees file for '{card_title}': {str(e)}"
            logger.error(f"❌ {error_msg}")
            errors.append({
                "card_title": card_title,
                "error": error_msg
            })
        except Exception as e:
            error_msg = f"Error loading rates and fees for '{card_title}': {str(e)}"
            logger.error(f"❌ {error_msg}")
            errors.append({
                "card_title": card_title,
                "error": error_msg
            })
    
    success = len(results) > 0
    
    logger.info(f"📊 Rates and fees fetch complete: {len(results)} successful, {len(errors)} failed")
    
    return {
        "success": success,
        "data": results,
        "errors": errors if errors else None,
        "count": len(card_titles),
        "successful": len(results),
        "failed": len(errors)
    }


def list_cards(category: Optional[CardCategory] = None, no_annual_fee: Optional[bool] = None) -> List[Dict[str, Any]]:
    logger.info(f"📋 Listing cards with category filter: {category}, no_annual_fee filter: {no_annual_fee}")
    
    try:
        with open('json/list_cards.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        logger.error("❌ json/list_cards.json not found")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"❌ Error parsing json/list_cards.json: {str(e)}")
        return []

    component_objects = data.get('componentObjects', {})
    
    if category is None or category == CardCategory.ALL:
        categories_to_process = [cat.value for cat in CardCategory if cat != CardCategory.ALL]
    else:
        categories_to_process = [category.value]
    
    logger.debug(f"Processing categories: {categories_to_process}")
    
    all_cards = []
    
    for cat in categories_to_process:
        items = component_objects.get(cat, [])
        logger.debug(f"Found {len(items)} items in category '{cat}'")
        
        for item in items:
            try:
                content = item['content']['Component']['Content']
                card_with_category = {**content, 'category': cat}
                all_cards.append(card_with_category)
            except (KeyError, TypeError) as e:
                logger.debug(f"Skipping invalid item in category '{cat}': {str(e)}")
                continue
    
    # Apply annual fee filter if specified
    if no_annual_fee is not None:
        def has_matching_fee(card: Dict[str, Any]) -> bool:
            """Check if card's annual fee matches the filter criteria."""
            fee_content = card.get('feature6_content', [])
            if not fee_content or len(fee_content) == 0:
                return False  # Exclude cards without fee information
            
            fee_text = fee_content[0].strip()
            is_no_fee = fee_text == '$0' or 'none' in fee_text.lower() or fee_text == '0'
            
            # Return True if filter matches the fee status
            return (no_annual_fee and is_no_fee) or (not no_annual_fee and not is_no_fee)
        
        all_cards = [card for card in all_cards if has_matching_fee(card)]
        logger.info(f"🔍 Filtered to {len(all_cards)} cards with {'no' if no_annual_fee else 'an'} annual fee")
    
    logger.info(f"✅ Retrieved {len(all_cards)} credit cards")
    return all_cards
