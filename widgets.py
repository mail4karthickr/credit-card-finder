"""
UI Widget configurations for Credit Card Finder MCP Server.
"""

import logging
from pathlib import Path
from typing import Any, Dict, List
from dataclasses import dataclass

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.info("=" * 80)
logger.info("🎨 Loading widgets.py module...")

# Load React bundles
WEB_DIR = Path(__file__).parent / "ui"
bundle_path = WEB_DIR / "dist/card-list.js"

# Check if UI bundles exist (but don't load them yet - lazy load on demand)
HAS_UI = bundle_path.exists()

# Example format for compare_cards tool
COMPARE_CARDS_EXAMPLE = '''{
  "cards": ["Card Name 1", "Card Name 2"],
  "benefit_rows": [
    {
      "benefit_name": "Intro offer",
      "card_values": {
        "Card Name 1": "$200 cash reward bonus when you spend $500 in purchases in the first 3 months",
        "Card Name 2": "Earn 20,000 bonus points when you spend $1,000 in purchases in the first 3 months"
      }
    },
    {
      "benefit_name": "Annual fee",
      "card_values": {
        "Card Name 1": "$0",
        "Card Name 2": "$95"
      }
    },
    {
      "benefit_name": "Rewards rate",
      "card_values": {
        "Card Name 1": "Earn unlimited 2% cash rewards on purchases",
        "Card Name 2": "3X points on restaurants, travel, gas stations"
      }
    }
  ],
  "recommended_card": {
    "card_name": "Card Name 2",
    "reason": "Best for travelers who want premium rewards"
  }
}'''



# Lazy-load function to load bundles only when needed
def _load_bundle(bundle_name: str) -> str:
    """Lazy-load a bundle file when needed, with caching."""
    try:
        bundle_file = WEB_DIR / f"dist/{bundle_name}.js"
        logger.debug(f"📦 Loading bundle: {bundle_name}.js")
        return bundle_file.read_text()
    except FileNotFoundError as e:
        logger.error(f"❌ Bundle not found: {bundle_name}.js")
        return "<div>UI not available. Build React components first.</div>"


logger.info(f"✅ UI bundles available: {HAS_UI}")


# Constants
MIME_TYPE = "text/html+skybridge"


@dataclass(frozen=True)
class CreditCardWidget:
    """Credit Card Widget configuration for card display."""
    identifier: str
    title: str
    description: str
    template_uri: str
    invoking: str
    invoked: str
    bundle_name: str  # Bundle file name (without .js extension)
    root_id: str      # Root element ID for React mounting
    response_text: str
    
    def get_html(self) -> str:
        """Lazy-load and generate HTML for this widget."""
        if not HAS_UI:
            return "<div>UI not available. Build React components first.</div>"
        
        bundle_content = _load_bundle(self.bundle_name)
        return (
            f"<style>\n"
            f"  * {{ margin: 0; padding: 0; box-sizing: border-box; }}\n"
            f"  html, body {{ margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; }}\n"
            f"  #{self.root_id} {{ margin: 0; padding: 0; width: 100%; }}\n"
            f"</style>\n"
            f"<div id=\"{self.root_id}\"></div>\n"
            f"<script type=\"module\">\n{bundle_content}\n</script>"
        )
    
    @property
    def html(self) -> str:
        """Property to get HTML (for compatibility)."""
        return self.get_html()


def _tool_meta(widget: CreditCardWidget) -> Dict[str, Any]:
    """Create tool metadata for OpenAI Apps SDK integration."""
    return {
        "openai/outputTemplate": widget.template_uri,
        "openai/toolInvocation/invoking": widget.invoking,
        "openai/toolInvocation/invoked": widget.invoked,
        "openai/widgetAccessible": True,
        "openai/resultCanProduceWidget": True,
        "openai/widgetDescription": widget.response_text,
        "annotations": {
            "destructiveHint": False,
            "openWorldHint": False,
            "readOnlyHint": True,
        }
    }


def _resource_description(widget: CreditCardWidget) -> str:
    """Generate resource description for a widget."""
    return f"{widget.description} Interactive widget for {widget.title}."


# Widget configurations
logger.info("📦 Creating widget configurations...")
widgets: List[CreditCardWidget] = [
    CreditCardWidget(
        identifier="list_wells_fargo_credit_cards",
        title="Wells Fargo Credit Card List",
        description=(
            "Display a list of Wells Fargo credit cards with their features, images, and benefits. "
            "Shows Wells Fargo card images, names, categories (Cash Back, Travel, Low Rate, Rewards), "
            "annual fees, introductory offers, rewards rates, and key features. "
            "Use for 'show Wells Fargo cards', 'list Wells Fargo credit cards', or 'available Wells Fargo cards' queries."
        ),
        template_uri="ui://widget/card-list.html",
        invoking="Loading credit cards...",
        invoked="Credit cards loaded successfully",
        bundle_name="card-list",
        root_id="card-list-root",
        response_text=(
            "Displayed Wells Fargo credit card options with the following details for each card:\n"
            "- Wells Fargo card name and high-quality product image\n"
            "- Category badge (Cash Back, Travel, Low Intro Rate, or Rewards)\n"
            "- Annual fee (displayed prominently: $0, $95, or $99)\n"
            "- Intro offer details (sign-up bonus or intro APR)\n"
            "- Rewards structure (cash back rates, points earning, or special benefits)\n"
            "- Quick-view highlights of key features\n"
            "Wells Fargo cards are organized by category and displayed in an interactive, user-friendly grid layout."
        )
    ),
    CreditCardWidget(
        identifier="compare_credit_cards",
        title="Compare Wells Fargo Credit Cards",
        description=(
            "**MANDATORY TOOL FOR CARD COMPARISONS AND RECOMMENDATIONS** - Display detailed credit card comparison in formatted UI table to help users choose the best card. "
            "\n\n"
            "**WHEN TO USE THIS TOOL** (ALL scenarios require this tool):\n"
            "1. Explicit comparison requests: 'Compare Card A and Card B', 'Show differences between cards'\n"
            "2. Recommendation questions: 'Which card should I choose?', 'Which one to buy?', 'What's the best card?'\n"
            "3. Decision-making queries: 'Which is better?', 'Recommend a card', 'Suggest the best card', 'Good card for me'\n"
            "4. Selection help: 'Help me decide', 'Best option', 'Top card', 'Which one is right for me?'\n"
            "\n"
            "**CRITICAL REQUIREMENT**: When users need to choose between cards or want recommendations, you MUST use this tool "
            "to display a detailed comparison table. DO NOT provide text-based comparisons or recommendations in the chat. "
            "This tool shows side-by-side details so users can make informed decisions themselves.\n"
            "\n"
            "**WORKFLOW (3 STEPS - ALL MANDATORY)**:\n"
            "1. Call 'fetch_rewards_and_benefits' with card names to get detailed benefit data\n"
            "2. Call 'fetch_rates_and_fees' with same card names to get rates and fee data\n"
            "3. Analyze the data, then call THIS tool to display the formatted comparison table with your recommendation\n"
            "\n"
            "**WHY THIS TOOL IS MANDATORY**:\n"
            "- Shows detailed side-by-side comparison in clean, formatted table\n"
            "- Helps users visually compare features and make their own choice\n"
            "- Automatically organizes data in easy-to-scan rows and columns\n"
            "- Much better user experience than text-based comparisons\n"
            "- Includes your recommendation with reasoning to guide user decision\n"
            "\n"
            f"**REQUIRED FORMAT**: Must provide data matching this exact structure:\n{COMPARE_CARDS_EXAMPLE}\n"
            "\n"
            "**BENEFIT ROWS**: Each benefit_row must compare the same feature across all cards. Common benefits include: "
            "'Intro offer', 'Annual fee', 'Rewards rate', 'Intro APR', 'Best for', 'Cell phone protection'. "
            "\n\n"
            "**IMPORTANT**: Always include 'recommended_card' with card_name and reason to help users choose. "
            "This tool is NOT just for comparing - it's for helping users make informed decisions by showing detailed comparisons!"
        ),
        template_uri="ui://widget/card-compare.html",
        invoking="Loading comparison...",
        invoked="Comparison ready",
        bundle_name="card-compare",
        root_id="card-compare-root",
        response_text="Displayed credit card comparison table"
    ),
]

WIDGETS_BY_ID: Dict[str, CreditCardWidget] = {widget.identifier: widget for widget in widgets}
WIDGETS_BY_URI: Dict[str, CreditCardWidget] = {widget.template_uri: widget for widget in widgets}

logger.info(f"✅ Registered {len(widgets)} widget(s)")
logger.info(f"   Widget IDs: {list(WIDGETS_BY_ID.keys())}")
logger.info(f"   Widget URIs: {list(WIDGETS_BY_URI.keys())}")
logger.info("=" * 80)
