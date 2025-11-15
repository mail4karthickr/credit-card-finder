# GitHub Copilot Instructions

## Project Overview
This is a Wells Fargo Credit Card Finder MCP Server with React UI widgets for card discovery, comparison, and recommendations.

## Important Guidelines

### ❌ DO NOT Create Documentation After Code Changes
- **NEVER** create summary documents after editing code
- **NEVER** create changelog files automatically
- **NEVER** generate documentation files like SUMMARY.md, CHANGES.md, etc.
- Code changes should be made directly without additional documentation files

### ✅ Code Editing Best Practices
- Make direct code edits to the relevant files
- Use inline comments within code when necessary
- Update existing documentation files only if explicitly requested
- Keep changes focused and specific to the task at hand

### Project Structure
- `/ui` - React components and UI widgets
- `/schemas.py` - Pydantic validation schemas
- `/tools.py` - MCP tool definitions and handlers
- `/widgets.py` - UI widget configurations
- `/service.py` - Business logic for card data and benefits
- `/server.py` - FastAPI/MCP server setup
- `/config.py` - Server configuration and instructions

### Technology Stack
- **Backend**: Python, FastAPI, MCP Server, Pydantic
- **Frontend**: React 18, styled-components, esbuild
- **Data**: Wells Fargo card data (data.json)
- **Integration**: OpenAI Apps SDK for widget rendering

### Key Features
1. `list_cards` - Browse and filter credit cards
2. `fetch_reward_benefits` - Fetch detailed benefits from Wells Fargo
3. `compare_cards` - Display comparison table in UI

### Workflow Reminders
- Always call `fetch_reward_benefits` before using `compare_cards`
- UI widgets must follow exact schema format
- Card images are bundled with esbuild dataurl loader
- Colors use Wells Fargo red (#D71E28) and navy blue theme

## Response Style
- Provide concise, actionable responses
- Focus on the specific task requested
- Avoid creating unnecessary files
- Make targeted edits to existing code
