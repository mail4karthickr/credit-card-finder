"""
HTTP routes for Credit Card Finder MCP Server.
"""

from starlette.responses import JSONResponse
from starlette.routing import Route

from config import SERVER_NAME, SERVER_VERSION, SERVER_DESCRIPTION, TOOL_NAMES
from widgets import widgets, HAS_UI, WIDGETS_BY_URI, MIME_TYPE
from service import fetch_reward_benefits, fetch_rates_and_fees


async def root(request):
    """Root endpoint - server information."""
    return JSONResponse({
        "name": "Credit Card Finder MCP Server",
        "status": "running",
        "version": SERVER_VERSION,
        "description": SERVER_DESCRIPTION,
        "endpoints": {
            "mcp_sse": "/mcp (SSE - for MCP clients only)",
            "mcp_messages": "/mcp/messages (HTTP POST - for stateless MCP)",
            "health": "/health",
            "info": "/info",
            "widgets": "/debug/widgets"
        },
        "note": "The /mcp endpoint requires 'Accept: text/event-stream' header and is meant for MCP clients (like Claude Desktop), not browsers."
    })


async def health(request):
    """Health check endpoint."""
    return JSONResponse({
        "status": "healthy",
        "server": SERVER_NAME
    })


async def server_info(request):
    """Server information endpoint."""
    return JSONResponse({
        "name": SERVER_NAME,
        "version": SERVER_VERSION,
        "description": SERVER_DESCRIPTION,
        "tools": len(TOOL_NAMES),
        "tool_list": TOOL_NAMES
    })


async def debug_widgets(request):
    """Debug endpoint showing widget registration."""
    if not HAS_UI:
        return JSONResponse({
            "status": "widgets_disabled",
            "message": "UI bundles not built. Run: cd ui && npm run build"
        })
    
    widget_info = []
    for widget in widgets:
        widget_info.append({
            "identifier": widget.identifier,
            "title": widget.title,
            "description": widget.description,
            "template_uri": widget.template_uri,
            "invoking": widget.invoking,
            "invoked": widget.invoked,
            "response_text": widget.response_text,
            "html_length": len(widget.html),
            "html_preview": widget.html[:200] + "..." if len(widget.html) > 200 else widget.html,
        })
    
    return JSONResponse({
        "status": "widgets_enabled",
        "mime_type": MIME_TYPE,
        "widget_count": len(widgets),
        "widgets": widget_info,
        "widgets_by_uri": list(WIDGETS_BY_URI.keys()),
    })


async def api_fetch_reward_benefits(request):
    """API endpoint to fetch reward benefits for one or more cards."""
    card_title = request.query_params.get('card_title')
    
    if not card_title:
        return JSONResponse({
            "success": False,
            "error": "card_title parameter is required"
        }, status_code=400)
    
    # Support both single card and array (for backward compatibility with UI)
    # The service function now expects a list
    card_titles = [card_title]
    
    result = fetch_reward_benefits(card_titles)
    return JSONResponse(result)


async def api_fetch_rates_and_fees(request):
    """API endpoint to fetch rates and fees for one or more cards."""
    card_title = request.query_params.get('card_title')
    
    if not card_title:
        return JSONResponse({
            "success": False,
            "error": "card_title parameter is required"
        }, status_code=400)
    
    # Support both single card and array (for backward compatibility with UI)
    # The service function now expects a list
    card_titles = [card_title]
    
    result = fetch_rates_and_fees(card_titles)
    return JSONResponse(result)


def get_routes():
    """Get all HTTP routes."""
    return [
        Route("/", root),
        Route("/health", health),
        Route("/info", server_info),
        Route("/debug/widgets", debug_widgets),
        Route("/api/fetch_reward_benefits", api_fetch_reward_benefits),
        Route("/api/fetch_rates_and_fees", api_fetch_rates_and_fees),
    ]
