"""
Credit Card Finder MCP Server

This is the main entry point for the Credit Card Finder MCP server.
It creates a FastMCP instance, registers MCP handlers, configures CORS,
and sets up HTTP routes for the server.

To run the server:
    python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000

The server exposes:
- SSE endpoint: http://localhost:8000/mcp
- Streamable-HTTP endpoint: http://localhost:8000/mcp/messages
- Health check: http://localhost:8000/health
- Server info: http://localhost:8000/info
- Debug widgets: http://localhost:8000/debug/widgets
"""

import logging
import sys
from fastmcp import FastMCP
from starlette.middleware.cors import CORSMiddleware

# Import configuration
from config import (
    SERVER_NAME,
    SERVER_VERSION,
    SERVER_DESCRIPTION,
    MCP_INSTRUCTIONS,
    SSE_PATH,
    MESSAGE_PATH,
    CORS_ALLOW_ORIGINS,
    CORS_ALLOW_METHODS,
    CORS_ALLOW_HEADERS,
    CORS_ALLOW_CREDENTIALS,
)

# Import MCP handlers registration
from mcp_handlers import register_mcp_handlers

# Import HTTP routes
from routes import get_routes

# Import widgets for logging
from widgets import widgets, HAS_UI

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

# Configure logging with force to override any previous configuration
logging.basicConfig(
    level=logging.DEBUG,
    format='%(levelname)s:%(name)s: %(message)s',
    stream=sys.stdout,
    force=True  # This forces reconfiguration
)

# Create logger for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Also set the root logger to DEBUG
logging.getLogger().setLevel(logging.DEBUG)

# Suppress verbose logs from uvicorn and mcp
logging.getLogger('uvicorn').setLevel(logging.INFO)
logging.getLogger('uvicorn.access').setLevel(logging.WARNING)
logging.getLogger('uvicorn.error').setLevel(logging.INFO)
logging.getLogger('mcp.server.streamable_http').setLevel(logging.INFO)

# ============================================================================
# SERVER CREATION
# ============================================================================

def create_mcp_server() -> FastMCP:
    """
    Create and configure the FastMCP server instance.
    
    Returns:
        FastMCP: Configured MCP server with registered handlers
    """
    logger.info("=" * 80)
    logger.info("🚀 Creating Credit Card Finder MCP Server")
    logger.info("=" * 80)
    logger.info(f"   Server Name: {SERVER_NAME}")
    logger.info(f"   Server Version: {SERVER_VERSION}")
    logger.info(f"   Server Description: {SERVER_DESCRIPTION}")
    logger.info(f"   SSE Path: {SSE_PATH}")
    logger.info(f"   Message Path: {MESSAGE_PATH}")
    logger.info(f"   UI Bundles Available: {HAS_UI}")
    logger.info(f"   Total Widgets: {len(widgets)}")
    logger.info("")
    
    # Create FastMCP instance with stateless HTTP mode
    logger.info("📦 Initializing FastMCP instance...")
    logger.debug(f"   - name: {SERVER_NAME}")
    logger.debug(f"   - instructions length: {len(MCP_INSTRUCTIONS)} characters")
    logger.debug(f"   - stateless_http: True (production mode)")
    logger.debug(f"   - sse_path: {SSE_PATH}")
    logger.debug(f"   - message_path: {MESSAGE_PATH}")
    
    mcp = FastMCP(
        name=SERVER_NAME,
        instructions=MCP_INSTRUCTIONS,
        stateless_http=True,  # Enable stateless HTTP mode for production
        sse_path=SSE_PATH,
        message_path=MESSAGE_PATH,
    )
    
    logger.info("✅ FastMCP instance created successfully")
    logger.info("")
    
    # Register MCP handlers (tools, resources, etc.)
    logger.info("🔧 Registering MCP protocol handlers...")
    register_mcp_handlers(mcp)
    logger.info("✅ MCP handlers registered successfully")
    logger.info("")
    
    logger.info("✅ MCP server creation completed!")
    logger.info("=" * 80)
    return mcp


def configure_app(mcp: FastMCP):
    """
    Configure the ASGI application with middleware and routes.
    
    Args:
        mcp: The FastMCP server instance
        
    Returns:
        The configured ASGI application
    """
    logger.info("=" * 80)
    logger.info("⚙️  Configuring ASGI Application")
    logger.info("=" * 80)
    
    # Get the streamable HTTP app
    logger.info("📡 Creating streamable HTTP app...")
    app = mcp.streamable_http_app()
    logger.info("✅ Streamable HTTP app created")
    logger.info("")
    
    # Add CORS middleware
    logger.info("🌐 Adding CORS middleware...")
    logger.debug(f"   - allow_origins: {CORS_ALLOW_ORIGINS}")
    logger.debug(f"   - allow_methods: {CORS_ALLOW_METHODS}")
    logger.debug(f"   - allow_headers: {CORS_ALLOW_HEADERS}")
    logger.debug(f"   - allow_credentials: {CORS_ALLOW_CREDENTIALS}")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ALLOW_ORIGINS,
        allow_methods=CORS_ALLOW_METHODS,
        allow_headers=CORS_ALLOW_HEADERS,
        allow_credentials=CORS_ALLOW_CREDENTIALS,
    )
    logger.info("✅ CORS middleware added")
    logger.info("")
    
    # Add custom HTTP routes
    logger.info("🛣️  Adding custom HTTP routes...")
    custom_routes = get_routes()
    logger.debug(f"   Total custom routes: {len(custom_routes)}")
    for route in custom_routes:
        logger.debug(f"   - {route.path} [{', '.join(route.methods) if hasattr(route, 'methods') and route.methods else 'GET'}]")
    
    app.routes.extend(custom_routes)
    logger.info("✅ Custom routes added")
    logger.info("")
    
    logger.info("✅ Application configuration completed!")
    logger.info("=" * 80)
    logger.info("")
    logger.info("🎉 Credit Card Finder MCP Server is ready!")
    logger.info("")
    logger.info("📍 Available endpoints:")
    logger.info(f"   - SSE: {SSE_PATH}")
    logger.info(f"   - Streamable-HTTP: {MESSAGE_PATH}")
    logger.info("   - Health check: /health")
    logger.info("   - Server info: /info")
    logger.info("   - Debug widgets: /debug/widgets")
    logger.info("")
    logger.info("=" * 80)
    
    return app


# ============================================================================
# MODULE-LEVEL INITIALIZATION
# ============================================================================

# Create the MCP server
logger.info("")
logger.info("=" * 80)
logger.info("🌟 CREDIT CARD FINDER MCP SERVER INITIALIZATION")
logger.info("=" * 80)
logger.info("")

mcp = create_mcp_server()

# Configure the ASGI application
app = configure_app(mcp)

logger.info("")
logger.info("=" * 80)
logger.info("✨ Initialization Complete - Server Ready")
logger.info("=" * 80)
logger.info("")

# Export the app for uvicorn
__all__ = ["app", "mcp"]
