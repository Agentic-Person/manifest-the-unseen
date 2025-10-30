# MCP Server Setup Guide

This guide explains how to configure the Model Context Protocol (MCP) servers for the Manifest the Unseen project.

## Prerequisites

You need API keys for the following services:
- Supabase (✅ already configured in `.env.local`)
- Pipedream (optional, for workflow automation)
- Whop (for platform integration)

## Security Approach

**All API keys are stored in `.env.local`** and referenced by `mcp.json` using environment variables. This keeps sensitive credentials out of configuration files and follows security best practices.

## Configuration Steps

### 1. Verify Supabase API Key

Your Supabase anon key is already configured in `.env.local` as `SUPABASE_ANON_KEY`. The `mcp.json` file references it using `${SUPABASE_ANON_KEY}`.

If you need to update it:
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/zbyszxtwzoylyygtexdr
2. Navigate to **Settings** → **API**
3. Copy your **anon/public** key
4. Update the `SUPABASE_ANON_KEY` value in `.env.local` (line 2)

### 2. Get Your Pipedream API Key (Optional)

1. Sign up at https://pipedream.com
2. Go to **Settings** → **API Keys**
3. Create a new API key
4. Update the `PIPEDREAM_API_KEY` value in `.env.local` (line 3)

**Note**: Pipedream MCP can work without an API key for basic operations, but will have rate limits.

### 3. Whop MCP Server

The Whop MCP server uses **Mint MCP**, which includes documentation for the Whop platform API. This doesn't require authentication to access docs, but you'll need Whop API credentials for actual API calls.

To get Whop credentials:
1. Go to https://whop.com/developers
2. Create a new app
3. Copy your API key, Client ID, and Client Secret
4. Add them to your `.env` file (see `.env.example`)

## Updated mcp.json Structure

The `mcp.json` file now uses environment variable references instead of hardcoded API keys:

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
        "PIPEDREAM_API_KEY": "${PIPEDREAM_API_KEY}"
      }
    },
    "supabase": {
      "type": "sse",
      "url": "https://mcp.supabase.com/mcp?project_ref=zbyszxtwzoylyygtexdr&api_key=${SUPABASE_ANON_KEY}"
    }
  }
}
```

## Changes Made

### ✅ Fixed Issues:

1. **Whop Server**: Changed from `whop-mcp-server-claude` (WHOOP fitness tracker) to `mint-mcp run whop` (Whop commerce platform)
2. **Supabase Server**: Now references `${SUPABASE_ANON_KEY}` from `.env.local` (already configured ✅)
3. **Pipedream Server**: Now references `${PIPEDREAM_API_KEY}` from `.env.local` (already configured ✅)
4. **Puppeteer Server**: Updated to use actively maintained `puppeteer-mcp-server` (v0.7.2) ✅
5. **Security**: API keys are now stored in `.env.local` instead of `mcp.json`

### 🔄 Next Steps:

1. ✅ All API keys configured in `.env.local`
2. ✅ `.env.local` is in `.gitignore` (prevents committing secrets)
3. **Restart Claude Code** to load the updated MCP configuration
4. Test each MCP server connection

### 🎭 Puppeteer Capabilities

The Puppeteer MCP server provides browser automation tools including:
- Navigate to URLs and take screenshots
- Fill forms and click elements
- Execute JavaScript in browser context
- Test web interfaces automatically
- Scrape dynamic content
- Generate PDFs of web pages

**Note**: Puppeteer downloads Chromium on first use (~170MB). This is normal and only happens once.

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
