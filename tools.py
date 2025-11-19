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
                annotations=types.ToolAnnotations(
                    title=widget.title,
                    readOnlyHint=True,  # Widget tools display data without modifying state
                    destructiveHint=False,
                    idempotentHint=True,  # Multiple calls with same args produce same result
                    openWorldHint=False,  # Works with closed dataset of Wells Fargo cards
                )
            )
        )
    
    # Add non-widget tools (data-fetching tools without UI)
    logger.info("🔧 Registering non-widget tools...")
    
    # fetch_rewards_and_benefits tool
    tools.append(
        types.Tool(
            name="fetch_rewards_and_benefits",
            title="Fetch Wells Fargo Credit Card Rewards and Benefits",
            description=(
                "**PURPOSE**\n"
                "Retrieves detailed reward benefits, features, and terms for specified credit cards. "
                "Returns comprehensive feature information including titles and detailed content for each benefit.\n"
                "\n"
                "**WHEN TO USE**\n"
                "Call this tool when user asks to:\n"
                "- Compare cards or compare specific cards by name\n"
                "- Understand which card is better or what the differences are\n"
                "- Get a suggestion or recommendation for a card\n"
                "- See the best card or best option for their needs\n"
                "- Choose between different card options\n"
                "- Find the best card for a specific use case or spending pattern\n"
                "This tool is the FIRST step before calling 'compare_cards'.\n"
                "\n"
                "**SEQUENCING REQUIREMENT**\n"
                "- Must be called before using 'compare_cards'\n"
                "- Always pair with 'fetch_rates_and_fees' before displaying comparison\n"
                "- Do not skip this step when comparing or recommending cards\n"
                "\n"
                "**INPUT**: Array of card names. Each must be: Active Cash, Attune, Autograph, Autograph Journey, "
                "Choice Privileges Mastercard, Choice Privileges Select Mastercard, One Key Card, One Key+ Card, or Reflect.\n"
                "**EXAMPLES**: ['Active Cash'], ['Autograph', 'Reflect'], or ['Active Cash', 'Autograph Journey', 'One Key+ Card']"
            ),
            inputSchema=schemas.get("fetch_rewards_and_benefits", {
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
            annotations=types.ToolAnnotations(
                title="Fetch Wells Fargo Credit Card Rewards and Benefits",
                readOnlyHint=True,  # Only reads data, doesn't modify anything
                destructiveHint=False,
                idempotentHint=True,  # Same input always returns same result
                openWorldHint=False,  # Works with closed dataset of Wells Fargo cards
            )
        )
    )
    logger.info("✅ Registered non-widget tool: fetch_rewards_and_benefits")
    
    # fetch_rates_and_fees tool
    tools.append(
        types.Tool(
            name="fetch_rates_and_fees",
            title="Fetch Wells Fargo Credit Card Rates and Fees",
            description=(
                "**PURPOSE**\n"
                "Retrieves comprehensive rates and fees information for specified credit cards. Returns detailed structured data including:\n"
                "- Product information (terms and conditions, intro bonus eligibility)\n"
                "- Interest Rates and Charges (APR for Purchases/Balance Transfers/Cash Advances, interest details, minimum charges)\n"
                "- Fees (Annual Fee, Transaction Fees for balance transfers/cash advances/foreign transactions, Penalty Fees)\n"
                "\n"
                "**WHEN TO USE**\n"
                "Call this tool when user asks to:\n"
                "- Compare cards or compare specific cards by name\n"
                "- Understand which card is better or what the differences are\n"
                "- Get a suggestion or recommendation for a card\n"
                "- See the best card or best option for their needs\n"
                "- Choose between different card options\n"
                "- Find the best card for a specific use case or spending pattern\n"
                "This tool is the SECOND step (after 'fetch_rewards_and_benefits') before calling 'compare_cards'.\n"
                "\n"
                "**SEQUENCING REQUIREMENT**\n"
                "- Must be called (along with 'fetch_rewards_and_benefits') before using 'compare_cards'\n"
                "- Always pair with 'fetch_rewards_and_benefits' before displaying comparison\n"
                "- Do not skip this step when comparing or recommending cards\n"
                "\n"
                "**INPUT**: Array of card names. Each must be: Active Cash, Attune, Autograph, Autograph Journey, "
                "Choice Privileges Mastercard, Choice Privileges Select Mastercard, One Key Card, One Key+ Card, or Reflect.\n"
                "**EXAMPLES**: ['Active Cash'], ['Autograph', 'Reflect'], or ['Active Cash', 'One Key+ Card']"
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
            annotations=types.ToolAnnotations(
                title="Fetch Wells Fargo Credit Card Rates and Fees",
                readOnlyHint=True,  # Only reads data, doesn't modify anything
                destructiveHint=False,
                idempotentHint=True,  # Same input always returns same result
                openWorldHint=False,  # Works with closed dataset of Wells Fargo cards
            )
        )
    )
    logger.info("✅ Registered non-widget tool: fetch_rates_and_fees")
    
    # get_all_credit_cards tool - returns all cards as plain data without UI
    tools.append(
        types.Tool(
            name="get_all_credit_cards",
            title="Get All Wells Fargo Credit Cards",
            description=(
                "**PURPOSE**\n"
                "Retrieves all Wells Fargo credit cards as structured data without displaying any UI widgets. "
                "Returns comprehensive card information including title, subtitle, category, features, intro offers, "
                "rewards, annual fees, and more.\n"
                "\n"
                "**WHEN TO USE**\n"
                "Use this tool when you need:\n"
                "- Raw credit card data for analysis or processing\n"
                "- Card information without triggering UI display\n"
                "- To programmatically access card details\n"
                "- To build custom responses or summaries about cards\n"
                "- Complete unfiltered list of all available cards\n"
                "\n"
                "**DIFFERENCE FROM list_wells_fargo_credit_cards**\n"
                "- list_wells_fargo_credit_cards: Returns data AND displays UI widget\n"
                "- get_all_credit_cards: Returns ONLY data, NO UI widget\n"
                "\n"
                "**NO FILTERS**\n"
                "- Always returns ALL cards without any filtering\n"
                "- No category filter\n"
                "- No annual fee filter\n"
                "\n"
                "**INPUT**: None required\n"
                "**OUTPUT**: Array of all card objects with complete card details"
            ),
            inputSchema=schemas.get("get_all_credit_cards", {
                "type": "object",
                "properties": {},
                "required": []
            }),
            annotations=types.ToolAnnotations(
                title="Get All Wells Fargo Credit Cards",
                readOnlyHint=True,  # Only reads data, doesn't modify anything
                destructiveHint=False,
                idempotentHint=True,  # Same input always returns same result
                openWorldHint=False,  # Works with closed dataset of Wells Fargo cards
            )
        )
    )
    logger.info("✅ Registered non-widget tool: get_all_credit_cards")
    
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
    if tool_name == "list_wells_fargo_credit_cards":
        return await _handle_list_wells_fargo_credit_cards(arguments)
    elif tool_name == "compare_credit_cards":
        return await _handle_compare_cards(arguments)
    elif tool_name == "fetch_rewards_and_benefits":
        return await _handle_fetch_rewards_and_benefits(arguments)
    elif tool_name == "fetch_rates_and_fees":
        return await _handle_fetch_rates_and_fees(arguments)
    elif tool_name == "get_all_credit_cards":
        return await _handle_get_all_credit_cards(arguments)
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


async def _handle_list_wells_fargo_credit_cards(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle list_wells_fargo_credit_cards tool call with optional category and annual fee filters."""
    logger.info("💳 Handling list_wells_fargo_credit_cards request")
    
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


async def _handle_fetch_rewards_and_benefits(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle fetch_rewards_and_benefits tool call."""
    logger.info("🎁 Handling fetch_rewards_and_benefits request")
    
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
        logger.error(f"❌ Error in fetch_rewards_and_benefits: {str(e)}")
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


async def _handle_get_all_credit_cards(arguments: Dict[str, Any]) -> types.ServerResult:
    """Handle get_all_credit_cards tool call - returns all cards without any filters or UI widget."""
    logger.info("📋 Handling get_all_credit_cards request (no filters, no UI widget)")
    
    try:
        # Pass None for both category and no_annual_fee to get ALL cards without any filtering
        cards = list_cards(None, None)
        
        logger.info(f"✅ Retrieved all {len(cards)} credit cards successfully (no filters applied)")
        
        # Return data WITHOUT structuredContent to avoid triggering UI widget
        result = types.ServerResult(
            types.CallToolResult(
                content=[types.TextContent(
                    type="text",
                    text=json.dumps({
                        "message": f"Successfully retrieved all {len(cards)} Wells Fargo credit cards.",
                        "count": len(cards),
                        "cards": cards
                    }, indent=2)
                )],
            )
        )
        
        logger.info("📦 Returning CallToolResult WITHOUT structuredContent (no UI widget)")
        logger.debug(f"   Card count: {len(cards)}")
        
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
