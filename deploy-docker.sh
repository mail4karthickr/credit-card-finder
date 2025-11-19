#!/bin/bash

# Wells Fargo Credit Card Finder - Docker Deployment Script
# This script helps you deploy the Credit Card Finder MCP server using Docker

set -e  # Exit on error

echo "💳 Wells Fargo Credit Card Finder - Docker Deployment"
echo "======================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "⚠️  IMPORTANT: Please review and update .env if needed"
        echo ""
        read -p "Press Enter to continue..."
    else
        echo "⚠️  No .env.example found. Creating minimal .env file..."
        cat > .env << 'EOF'
# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=8001
LOG_LEVEL=INFO

# Add your environment variables here if needed
EOF
        echo "✅ Created minimal .env file"
    fi
fi

echo "✅ Environment variables configured"
echo ""

# Build and start the container
echo "🔨 Building and starting Docker container..."
echo ""

if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

echo ""
echo "✅ Credit Card Finder server is running!"
echo ""
echo "📊 Server Information:"
echo "   - URL: http://localhost:8001"
echo "   - Health Check: http://localhost:8001/health"
echo "   - MCP Endpoint: http://localhost:8001/mcp"
echo ""
echo "📝 Useful Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop server: docker-compose down"
echo "   - Restart server: docker-compose restart"
echo "   - Check health: docker inspect --format='{{.State.Health.Status}}' credit-card-finder-server"
echo ""
echo "🎉 Setup complete!"
