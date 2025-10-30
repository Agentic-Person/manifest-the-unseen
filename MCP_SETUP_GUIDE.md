
# MCP Server Setup Guide

This guide explains how to configure the Model Context Protocol (MCP) servers for the Manifest the Unseen project.

## Prerequisites

You need API keys for the following services:
- Supabase (project already created)
- Pipedream (optional, for workflow automation)
- Whop (for platform integration)

## Configuration Steps

### 1. Get Your Supabase API Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr
2. Navigate to **Settings** → **API**
3. Copy your **anon/public** key
4. Update `mcp.json` line 16, replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual key

### 2. Get Your Pipedream API Key (Optional)

1. Sign up at https://pipedream.com
2. Go to **Settings** → **API Keys**
3. Create a new API key
4. Update `mcp.json` line 11, replace `YOUR_PIPEDREAM_API_KEY_HERE` with your actual key

**Note**: Pipedream MCP can work without an API key for basic operations, but will have rate limits.

### 3. Whop MCP Server

The Whop MCP server uses **Mint MCP**, which includes documentation for the Whop platform API. This doesn't require authentication to access docs, but you'll need Whop API credentials for actual API calls.

To get Whop credentials:
1. Go to https://whop.com/developers
2. Create a new app
3. Copy your API key, Client ID, and Client Secret
4. Add them to your `.env` file (see `.env.example`)

## Updated mcp.json Structure

```json
{
  "mcpServers": {
    "whop": {
      "command": "npx",
      "args": ["-y", "mint-mcp", "run", "whop"]
    },
    "pipedream": {
      "command": "npx",
      "args": ["@pipedream/mcp"],
      "env": {
        "PIPEDREAM_API_KEY": "YOUR_API_KEY"
      }
    },
    "supabase": {
      "type": "sse",
      "url": "https://mcp.supabase.com/mcp?project_ref=zbyszxtwzoylyygtexdr&api_key=YOUR_API_KEY"
    }
  }
}
```

## Changes Made

### ✅ Fixed Issues:

1. **Whop Server**: Changed from `whop-mcp-server-claude` (WHOOP fitness tracker) to `mint-mcp run whop` (Whop commerce platform)
2. **Supabase Server**: Added `api_key` parameter to the URL (needs your actual key)
3. **Pipedream Server**: Added `env` section for API key configuration
4. **Puppeteer Server**: Removed (package deprecated and no longer supported)

### 🔄 Next Steps:

1. Replace placeholder API keys in `mcp.json` with your actual keys
2. Copy `.env.example` to `.env` and fill in all credentials
3. Restart Claude Code to load the updated MCP configuration
4. Test each MCP server connection

## Testing MCP Servers

After configuration, you can verify the servers are working by asking Claude Code to:
- Query Supabase tables
- Access Whop API documentation
- Create Pipedream workflows

## Troubleshooting

**Issue**: MCP server not loading
- **Solution**: Ensure API keys are correct and not expired
- **Solution**: Check that `mcp.json` has valid JSON syntax
- **Solution**: Restart Claude Code after configuration changes

**Issue**: 401 Unauthorized errors
- **Solution**: Verify API keys are correctly placed in `mcp.json`
- **Solution**: Ensure Supabase project is active and not paused

**Issue**: npx package not found
- **Solution**: Ensure you have Node.js 18+ installed
- **Solution**: Clear npm cache: `npm cache clean --force`

## Reference Links

- [Whop API Docs](https://docs.whop.com/api)
- [Supabase MCP Server](https://mcp.supabase.com)
- [Pipedream MCP](https://mcp.pipedream.com)
- [Mint MCP](https://www.npmjs.com/package/mint-mcp)
- [Model Context Protocol Docs](https://modelcontextprotocol.io)
