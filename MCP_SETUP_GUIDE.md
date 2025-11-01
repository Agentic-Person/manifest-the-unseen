# MCP Server Setup Guide

This guide explains how to configure the Model Context Protocol (MCP) servers for the Manifest the Unseen project.

## Overview

This project uses **6 MCP servers** configured across multiple applications:
- **Whop** - Whop commerce platform API documentation and integration
- **Pipedream** - Workflow automation and API orchestration
- **Supabase** - Direct database operations and queries
- **Puppeteer** - Browser automation and web testing
- **n8n-mcp** - n8n workflow automation server
- **Canva** - Canva design creation and management

## Configuration Files

MCP servers are configured in multiple locations depending on which application you're using:

1. **Claude Code**: `.claude/settings.json` (project-specific)
2. **Cursor IDE**: `.cursor/mcp.json` (project-specific) + `c:\Users\jimmy\.cursor\mcp.json` (global)
3. **Claude Desktop**: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
4. **Project Root**: `.mcp.json` (reference configuration)

All configurations should be synchronized to ensure consistency across applications.

## Prerequisites

You need API keys for the following services:
- **Supabase** (project already created) - Project ID: `Yzbyszxtwzoylyygtexdr`
- **Pipedream** (recommended, for workflow automation)
- **Whop** (required, for platform integration)
- **n8n-mcp** (optional, requires local n8n installation)
- **Puppeteer** (no API key needed, uses npx)
- **Canva** (no API key needed for basic usage, uses npx)

**System Requirements:**
- Node.js 18+ installed (for npx commands)
- Access to npm registry (for package downloads)

## Configuration Steps

### 1. Get Your Supabase Project Reference

**Note**: Supabase MCP uses OAuth authentication - no API key needed in the URL!

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/Yzbyszxtwzoylyygtexdr
2. The project reference is: `Yzbyszxtwzoylyygtexdr` (note the capital Y)
3. OAuth will prompt on first connection - no manual API key configuration needed

### 2. Get Your Pipedream API Key (Recommended)

1. Sign up at https://pipedream.com
2. Go to **Settings** → **API Keys**
3. Create a new API key
4. Add it to your MCP configuration `env` section (see below)

**Note**: Pipedream MCP can work without an API key for basic operations, but will have rate limits.

### 3. Get Your Whop API Key

The Whop MCP server uses **Mint MCP**, which includes documentation for the Whop platform API. 

To get Whop credentials:
1. Go to https://whop.com/developers
2. Create a new app
3. Copy your API key
4. Add it to your MCP configuration `env` section (see below)

### 4. Set Up n8n-mcp (Optional)

If you want to use the n8n-mcp server:

1. Clone or navigate to your n8n-mcp installation: `C:\Users\jimmy\n8n-mcp`
2. Build the project if needed: `npm run build`
3. Verify the file exists: `dist\mcp\index.js`
4. The configuration will use this local path

### 5. Puppeteer Setup

No additional setup needed! Puppeteer will automatically download Chromium on first use (~170MB).

### 6. Canva Setup

No additional setup needed! Canva MCP uses the Canva CLI package which will be downloaded automatically via npx.

## Complete MCP Configuration

Here's the complete `mcp.json` structure with all 6 servers configured:

```json
{
  "mcpServers": {
    "whop": {
      "command": "npx",
      "args": ["-y", "mint-mcp", "run", "whop"],
      "env": {
        "WHOP_API_KEY": "YOUR_WHOP_API_KEY_HERE"
      }
    },
    "pipedream": {
      "command": "npx",
      "args": ["-y", "@pipedream/mcp"],
      "env": {
        "PIPEDREAM_API_KEY": "YOUR_PIPEDREAM_API_KEY_HERE"
      }
    },
    "supabase": {
      "type": "sse",
      "url": "https://mcp.supabase.com/mcp?project_ref=Yzbyszxtwzoylyygtexdr"
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "n8n-mcp": {
      "args": [
        "C:\\Users\\jimmy\\n8n-mcp\\dist\\mcp\\index.js"
      ],
      "command": "node",
      "env": {
        "DISABLE_CONSOLE_OUTPUT": "true",
        "LOG_LEVEL": "error",
        "MCP_MODE": "stdio",
        "NODE_ENV": "production"
      }
    },
    "canva": {
      "command": "npx",
      "args": [
        "-y",
        "@canva/cli@latest",
        "mcp"
      ]
    }
  }
}
```

**Important Notes:**
- Replace `YOUR_WHOP_API_KEY_HERE` and `YOUR_PIPEDREAM_API_KEY_HERE` with your actual keys
- Supabase uses OAuth - no API key needed in the URL (will prompt on first use)
- Update the n8n-mcp path if your installation is in a different location
- Canva MCP requires no API key for basic usage (uses npx to download CLI automatically)
- All config files should use the same structure

## Configuration Details

### Server-Specific Notes

1. **Whop Server**: 
   - Uses `mint-mcp run whop` for Whop commerce platform API docs
   - Requires `WHOP_API_KEY` in env section for API calls
   - No authentication needed for documentation access

2. **Pipedream Server**: 
   - Uses `@pipedream/mcp` package
   - Requires `-y` flag for non-interactive installation
   - Requires `PIPEDREAM_API_KEY` in env section
   - Can work without API key but with rate limits

3. **Supabase Server**: 
   - Uses SSE (Server-Sent Events) connection type
   - Uses OAuth authentication (no API key in URL)
   - Project reference: `Yzbyszxtwzoylyygtexdr` (note capital Y)
   - Will prompt for OAuth on first connection

4. **Puppeteer Server**: 
   - Uses official `@modelcontextprotocol/server-puppeteer` package
   - No API key or authentication needed
   - Will download Chromium (~170MB) on first use
   - Requires disk space for Chromium installation

5. **n8n-mcp Server**: 
   - Uses local Node.js installation
   - Requires path to built `index.js` file
   - Configured with production environment variables
   - Optional - only needed if using n8n workflows

6. **Canva Server**: 
   - Uses `@canva/cli` package via npx
   - No API key required for basic usage
   - Allows AI-powered design creation and management
   - Automatically downloads CLI on first use

## Setup Checklist

### ✅ Configuration Steps:

1. **Update all MCP configuration files** with your API keys:
   - `.claude/settings.json` (Claude Code)
   - `.cursor/mcp.json` (Cursor project)
   - Global Cursor config (if using)
   - Claude Desktop config (if using)

2. **Replace placeholder API keys** in all config files:
   - `YOUR_WHOP_API_KEY_HERE` → Your actual Whop API key
   - `YOUR_PIPEDREAM_API_KEY_HERE` → Your actual Pipedream API key

3. **Verify Supabase project reference** is correct: `Yzbyszxtwzoylyygtexdr`

4. **Set up permissions** (for Claude Code):
   - Update `.claude/settings.local.json` to allow MCP, node, npx commands

5. **Restart applications** to load MCP configuration:
   - Restart Cursor completely (close all windows)
   - Restart Claude Desktop (if using)
   - Restart Claude Code (if using)

6. **Test each MCP server** individually

## Testing MCP Servers

After configuration, you can verify the servers are working by asking Claude to:

- **Whop**: "Show me Whop API documentation" or "List Whop API endpoints"
- **Pipedream**: "List my Pipedream workflows" or "Create a Pipedream workflow"
- **Supabase**: "List Supabase tables" or "Query the user_profiles table"
- **Puppeteer**: "Take a screenshot of google.com" or "Navigate to example.com"
- **n8n-mcp**: "List n8n workflows" or "Check n8n server status"
- **Canva**: "Create a new Canva design" or "How many components are in the App UI Kit?"

You can also check MCP server status:
- **Cursor**: Settings → MCP or check Output panel
- **Claude Desktop**: Check settings/preferences
- **Claude Code**: Use `/mcp` command or check status

## Troubleshooting

**Issue**: MCP server not loading
- **Solution**: Ensure API keys are correct and not expired
- **Solution**: Check that config files have valid JSON syntax
- **Solution**: Restart the application completely after configuration changes
- **Solution**: Verify Node.js 18+ is installed: `node --version`

**Issue**: Supabase returns 401 Unauthorized
- **Solution**: Supabase uses OAuth - remove any `api_key` or `anon_key` from URL
- **Solution**: Ensure project reference is correct: `Yzbyszxtwzoylyygtexdr` (capital Y)
- **Solution**: Verify Supabase project is active and not paused
- **Solution**: OAuth will prompt on first connection - authenticate through browser

**Issue**: Pipedream fails silently
- **Solution**: Verify API key at pipedream.com/settings/keys
- **Solution**: Ensure `-y` flag is present in args for non-interactive install
- **Solution**: Try running without API key (limited functionality)

**Issue**: Puppeteer hangs or fails
- **Solution**: Let it download Chromium (~170MB, one-time download)
- **Solution**: Check disk space availability
- **Solution**: Ensure using `@modelcontextprotocol/server-puppeteer` (not deprecated packages)
- **Solution**: Verify internet connection for Chromium download

**Issue**: n8n-mcp not found
- **Solution**: Verify path exists: `C:\Users\jimmy\n8n-mcp\dist\mcp\index.js`
- **Solution**: Rebuild n8n-mcp: `cd C:\Users\jimmy\n8n-mcp && npm run build`
- **Solution**: Update path in config if installation is elsewhere
- **Solution**: Check Node.js version (requires Node 18+)

**Issue**: npx package not found
- **Solution**: Ensure you have Node.js 18+ installed from nodejs.org
- **Solution**: Clear npm cache: `npm cache clean --force`
- **Solution**: Verify npm is in your PATH: `npm --version`

**Issue**: Config files out of sync
- **Solution**: Ensure all config files are updated (see Configuration Files section)
- **Solution**: Copy configuration from `.mcp.json` to other locations
- **Solution**: Restart each application after updating configs

**Issue**: Canva MCP not working
- **Solution**: Ensure Node.js v20 or later is installed: `node --version`
- **Solution**: Verify npx is accessible: `npx --version`
- **Solution**: Canva CLI will download automatically on first use - allow time for download
- **Solution**: Check internet connection for npx package download

## Reference Links

- [Whop API Docs](https://docs.whop.com/api)
- [Supabase MCP Server](https://mcp.supabase.com)
- [Pipedream MCP](https://mcp.pipedream.com)
- [Mint MCP](https://www.npmjs.com/package/mint-mcp)
- [Puppeteer MCP Server](https://www.npmjs.com/package/@modelcontextprotocol/server-puppeteer)
- [Canva MCP Server](https://www.canva.dev/docs/connect/mcp-server/)
- [Model Context Protocol Docs](https://modelcontextprotocol.io)
- [n8n Documentation](https://docs.n8n.io)

## Quick Reference

**Project Details:**
- **Name**: Manifest the Unseen
- **Location**: `C:\projects\manifest_the_unseen`
- **Supabase Project**: `Yzbyszxtwzoylyygtexdr` (capital Y)
- **Tech Stack**: Next.js, Supabase, Claude Haiku 4.5

**Current Status:**
- ✅ All 6 MCP servers configured
- ✅ Config files synchronized across applications
- ✅ Ready for testing after application restarts
