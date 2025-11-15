import json
import re
import logging
from typing import List, Dict, Any
import mcp.types as types
from widgets import widgets, _tool_meta
from service import list_cards, CardCategory, fetch_reward_benefits, fetch_rates_and_fees
from schemas import get_schemas

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def get_tool_definitions() -> List[types.Tool]:
    """Get all available tool definitions (widget-based and non-widget tools)."""
    tools = []
    schemas = get_schemas()
    
    logger.info(f"🔧 Generating tool definitions. Found {len(widgets)} widgets")
    
    # Add widget-based tools (with UI)
    for widget in widgets:
        meta = _tool_meta(widget)
        logger.info(f"✅ Registering widget tool: {widget.identifier}")
        logger.debug(f"   Widget metadata: {meta}")
        
        # Get schema for this widget if available
        input_schema = schemas.get(widget.identifier, {
            "type": "object",
            "properties": {},
            "required": []
        })
        
        tools.append(
            types.Tool(
                name=widget.identifier,
                title=widget.title,
                description=widget.description,
                inputSchema=input_schema,
                _meta=meta,
            )
        )
    
    # Add non-widget tools (data-fetching tools without UI)
    logger.info("🔧 Registering non-widget tools...")
    
    # fetch_reward_benefits tool
    tools.append(
        types.Tool(
            name="fetch_reward_benefits",
            description=(
                "Fetch detailed reward benefits, features, and terms for one or more Wells Fargo credit cards. "
                "Returns comprehensive feature information including titles and detailed content for each benefit. "
                "Use this when you need to get the complete feature and benefit terms for specific cards. "
                "Accepts an array of card names. Each card name must be one of: Active Cash, Attune, Autograph, "
                "Autograph Journey, Choice Privileges Mastercard, Choice Privileges Select Mastercard, "
                "One Key Card, One Key+ Card, or Reflect. "
                "Examples: ['Active Cash'], ['Autograph', 'Reflect'], or ['Active Cash', 'Autograph Journey', 'One Key+ Card']"
            ),
            inputSchema=schemas.get("fetch_reward_benefits", {
                "type": "object",
                "properties": {
                    "card_titles": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of Wells Fargo credit card names"
                    }
                },
                "required": ["card_titles"]
            }),
        )
    )
    logger.info("✅ Registered non-widget tool: fetch_reward_benefits")
    
    # fetch_rates_and_fees tool
    tools.append(
        types.Tool(
            name="fetch_rates_and_fees",
            description=(
                "Fetch comprehensive rates and fees information for one or more Wells Fargo credit cards. "
                "Returns detailed structured data including:\n"
                "- Product information (terms and conditions, intro bonus eligibility)\n"
                "- Interest Rates and Charges:\n"
                "  * APR for Purchases (intro rate, post-intro rate, rate basis)\n"
                "  * APR for Balance Transfers (intro rate, post-intro rate, eligibility requirements)\n"
                "  * APR for Cash Advances and Overdraft Protection\n"
                "  * How to avoid paying interest on purchases\n"
                "  * Minimum interest charge\n"
                "- Fees:\n"
                "  * Annual Fee\n"
                "  * Transaction Fees (balance transfers, cash advances, foreign transactions)\n"
                "  * Penalty Fees (late payment)\n\n"
                "Use this when you need to compare pricing, understand costs, or get complete terms and conditions for cards. "
                "Accepts an array of card names. Each card name must be one of: Active Cash, Attune, Autograph, "
                "Autograph Journey, Choice Privileges Mastercard, Choice Privileges Select Mastercard, "
                "One Key Card, One Key+ Card, or Reflect. "
                "Examples: ['Active Cash'], ['Autograph', 'Reflect'], or ['Active Cash', 'One Key+ Card']"
            ),
            inputSchema=schemas.get("fetch_rates_and_fees", {
                "type": "object",
                "properties": {
                    "card_titles": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of Wells Fargo credit card names"
                    }
                },
                "required": ["card_titles"]
            }),
        )
    )
    logger.info("✅ Registered non-widget tool: fetch_rates_and_fees")
    
    logger.info(f"📋 Total tools registered: {len(tools)}")
    return tools


async def handle_tool_call(req: types.CallToolRequest) -> types.ServerResult:
    """
    Handle tool call requests by routing to appropriate handlers.
    
    Args:
        req: The tool call request containing tool name and arguments
        
    Returns:
        ServerResult with tool execution results
    """
    tool_name = req.params.name
    arguments = req.params.arguments or {}
    
    logger.info(f"🔧 Handling tool call: {tool_name}")
    logger.debug(f"   Arguments: {arguments}")
    
    # Route to appropriate handler
    if tool_name == "list_cards":
        return await _handle_list_cards(arguments)
    elif tool_name == "compare_cards":
        return await _handle_compare_cards(arguments)
    elif tool_name == "fetch_reward_benefits":
        return await _handle_fetch_reward_benefits(arguments)
    elif tool_name == "fetch_rates_and_fees":
        return await _handle_fetch_rates_and_fees(arguments)
    else:
        error_msg = f"Unknown tool: {tool_name}"
        logger.error(f"❌ {error_msg}")
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=error_msg
                )],
                isError=True,
            )
        )


async def _handle_list_cards(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle list_cards tool call with optional category and annual fee filters."""
    logger.info("💳 Handling list_cards request")
    
    # Get category from arguments if provided
    category = None
    if arguments and "category" in arguments:
        category_str = arguments["category"]
        try:
            category = CardCategory(category_str)
            logger.info(f"🏷️  Filtering by category: {category.value}")
        except ValueError:
            logger.warning(f"⚠️  Invalid category '{category_str}', returning all cards")
    
    # Get no_annual_fee filter from arguments if provided
    no_annual_fee = arguments.get("no_annual_fee") if arguments else None
    if no_annual_fee is not None:
        logger.info(f"💰 Filtering by annual fee: {'No annual fee' if no_annual_fee else 'Has annual fee'}")
    
    try:
        cards = list_cards(category, no_annual_fee)
        
        logger.info(f"✅ Retrieved {len(cards)} credit cards successfully")
        
        # Build filter description for response message
        filter_parts = []
        if category and category != CardCategory.ALL:
            filter_parts.append(f"in {category.value} category")
        if no_annual_fee is True:
            filter_parts.append("with no annual fee")
        elif no_annual_fee is False:
            filter_parts.append("with annual fee")
        
        filter_desc = " ".join(filter_parts) if filter_parts else ""
        
        # structuredContent must be a dictionary, not a list
        # Wrap the cards list in a dictionary
        result = types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Successfully retrieved {len(cards)} Wells Fargo credit cards{' ' + filter_desc if filter_desc else ''}."
                )],
                structuredContent={"cards": cards},
            )
        )
        
        logger.info("📦 Returning CallToolResult with structuredContent")
        logger.debug(f"   Card count: {len(cards)}")
        logger.info("🎨 This response should trigger widget display (has structuredContent)")
        
        return result
    except Exception as e:
        logger.error(f"❌ Error retrieving cards: {str(e)}")
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Error retrieving credit cards: {str(e)}"
                )],
                isError=True,
            )
        )


async def _handle_compare_cards(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle compare_cards tool call to display comparison UI."""
    logger.info("⚖️  Handling compare_cards request")
    
    # Validate required fields
    cards = arguments.get("cards")
    benefit_rows = arguments.get("benefit_rows")
    recommended_card = arguments.get("recommended_card")
    
    if not cards or not isinstance(cards, list):
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: 'cards' parameter is required and must be a list of card names"
                )],
                isError=True,
            )
        )
    
    if not benefit_rows or not isinstance(benefit_rows, list):
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: 'benefit_rows' parameter is required and must be a list of benefit objects"
                )],
                isError=True,
            )
        )
    
    try:
        logger.info(f"✅ Displaying comparison for {len(cards)} card(s) with {len(benefit_rows)} benefit rows")
        
        result = types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Displaying comparison of {len(cards)} credit cards: {', '.join(cards)}"
                )],
                structuredContent=arguments,
            )
        )
        
        logger.info("📦 Returning CallToolResult with comparison data")
        logger.info("🎨 This response should trigger widget display (has structuredContent)")
        
        return result
    except Exception as e:
        logger.error(f"❌ Error in compare_cards: {str(e)}")
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Error displaying card comparison: {str(e)}"
                )],
                isError=True,
            )
        )


async def _handle_fetch_reward_benefits(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle fetch_reward_benefits tool call."""
    logger.info("🎁 Handling fetch_reward_benefits request")
    
    card_titles = arguments.get("card_titles")
    if not card_titles:
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: card_titles parameter is required (must be a list of card names)"
                )],
                isError=True,
            )
        )
    
    if not isinstance(card_titles, list):
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: card_titles must be a list (array) of card names"
                )],
                isError=True,
            )
        )
    
    try:
        result = fetch_reward_benefits(card_titles)
        
        if result['success']:
            logger.info(f"✅ Successfully fetched reward benefits for all {len(card_titles)} card(s)")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Successfully retrieved reward benefits for {result['successful']} card(s): {', '.join(card_titles)}"
                    )],
                    structuredContent=result,
                )
            )
        elif result['successful'] > 0:
            # Partial success
            logger.warning(f"⚠️ Partial success: {result['successful']} successful, {result['failed']} failed")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Partially retrieved reward benefits: {result['successful']} successful, {result['failed']} failed. Check 'errors' field for details."
                    )],
                    structuredContent=result,
                )
            )
        else:
            logger.error(f"❌ Failed to fetch reward benefits for all cards")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Error: Failed to fetch reward benefits for all {len(card_titles)} card(s). Check 'errors' field for details."
                    )],
                    structuredContent=result,
                    isError=True,
                )
            )
    except Exception as e:
        logger.error(f"❌ Error in fetch_reward_benefits: {str(e)}")
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Error fetching reward benefits: {str(e)}"
                )],
                isError=True,
            )
        )


async def _handle_fetch_rates_and_fees(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle fetch_rates_and_fees tool call."""
    logger.info("💰 Handling fetch_rates_and_fees request")
    
    card_titles = arguments.get("card_titles")
    if not card_titles:
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: card_titles parameter is required (must be a list of card names)"
                )],
                isError=True,
            )
        )
    
    if not isinstance(card_titles, list):
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text="Error: card_titles must be a list (array) of card names"
                )],
                isError=True,
            )
        )
    
    try:
        result = fetch_rates_and_fees(card_titles)
        
        if result['success']:
            logger.info(f"✅ Successfully fetched rates and fees for all {len(card_titles)} card(s)")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Successfully retrieved rates and fees for {result['successful']} card(s): {', '.join(card_titles)}"
                    )],
                    structuredContent=result,
                )
            )
        elif result['successful'] > 0:
            # Partial success
            logger.warning(f"⚠️ Partial success: {result['successful']} successful, {result['failed']} failed")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Partially retrieved rates and fees: {result['successful']} successful, {result['failed']} failed. Check 'errors' field for details."
                    )],
                    structuredContent=result,
                )
            )
        else:
            logger.error(f"❌ Failed to fetch rates and fees for all cards")
            return types.ServerResult(
                types.CallToolResult(
                    content=[types.TextContent(
                        type="text",
                        text=f"Error: Failed to fetch rates and fees for all {len(card_titles)} card(s). Check 'errors' field for details."
                    )],
                    structuredContent=result,
                    isError=True,
                )
            )
    except Exception as e:
        logger.error(f"❌ Error in fetch_rates_and_fees: {str(e)}")
        return types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=f"Error fetching rates and fees: {str(e)}"
                )],
                isError=True,
            )
        )

if __name__ == '__main__':
    cards = list_cards()
    
    print(f"Found {len(cards)} credit cards\n")
    print("=" * 80)
    
    for i, card in enumerate(cards, 1):
        print(f"\n{i}. {card.get('title', 'N/A')} [Category: {card.get('category', 'N/A')}]")
        print(f"   Subtitle: {card.get('subtitle', '')}")
        
        intro = card.get('feature4_content', [])
        print(f"   Intro Offer: {intro[0] if intro else 'N/A'}")
        
        rewards = card.get('feature5_content', [])
        print(f"   Rewards: {(rewards[0]) if rewards else 'N/A'}")
        
        fee = card.get('feature6_content', [])
        print(f"   Annual Fee: {fee[0] if fee else 'N/A'}")
