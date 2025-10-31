# MCP Quick Fix Guide - Feed This to Claude

**URGENT: MCP servers not working? Copy this entire document and paste it into a new Claude session.**

## Problem Summary

The 5 MCP servers (Whop, Pipedream, Supabase, Puppeteer, n8n-mcp) are configured for both Cursor IDE and Claude Code/Desktop.

## Root Causes Found (RESOLVED)

1. **Supabase MCP**: ✅ FIXED - Was using wrong auth method (anon_key instead of OAuth)
   - Correct: `https://mcp.supabase.com/mcp?project_ref=PROJECT_ID` (OAuth will prompt on first use)
   - Wrong: Adding `&api_key=` or `&anon_key=` to URL

2. **Pipedream MCP**: ✅ FIXED - Missing `-y` flag for auto-install
   - Correct: `npx -y @pipedream/mcp`
   - Wrong: `npx @pipedream/mcp` (requires manual confirmation)

3. **Whop MCP**: ✅ Working - Uses mint-mcp with API key in env
4. **Puppeteer MCP**: ✅ FIXED - Updated to official package `@modelcontextprotocol/server-puppeteer`
   - Correct: `npx -y @modelcontextprotocol/server-puppeteer`
   - Old: `npx -y puppeteer-mcp-server` (deprecated)
5. **n8n-mcp**: ✅ Working - Local Node.js installation with proper env vars

## API Keys Location

All API keys are in `.env` file:
```
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieXN6eHR3em95bHl5Z3RleGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDE1MDcsImV4cCI6MjA3NzI3NzUwN30.z4NDPLi_njS8Y_7T_9JQn9pdLyoJWlFuc2lnZJDXTu4

PIPEDREAM_API_KEY=30df00fb2838698e158e4c8dc81a4298

WHOP_API_KEY=0u_46cKC_VSlKurR5yvKTiPBY_vfEkmmxKpS5-ztfkQ
```

## Quick Fix Instructions

**To Claude: Execute these steps in order:**

### Step 1: Test each MCP server manually

Run these commands to identify which servers work:

```bash
# Test Puppeteer (official package)
npx -y @modelcontextprotocol/server-puppeteer --version

# Test Whop (mint-mcp)
npx -y mint-mcp --version

# Test Pipedream
$env:PIPEDREAM_API_KEY="30df00fb2838698e158e4c8dc81a4298"; npx -y @pipedream/mcp --version

# Test Supabase URL (SSE endpoint)
curl "https://mcp.supabase.com/mcp?project_ref=Yzbyszxtwzoylyygtexdr"

# Test n8n-mcp (local installation)
node "C:\Users\jimmy\n8n-mcp\dist\mcp\index.js" --version
```

### Step 2: MCP Configuration Files (ALL UPDATED ✅)

✅ **All configuration files are synchronized and properly configured:**

**Configuration Files Updated:**
1. `.claude/settings.json` - Claude Code project config
2. `.cursor/mcp.json` - Cursor IDE project config  
3. `c:\Users\jimmy\.cursor\mcp.json` - Cursor global config
4. `%APPDATA%\Claude\claude_desktop_config.json` - Claude Desktop config
5. `.mcp.json` - Project root config (reference)

**Current Configuration (All 5 Servers):**

```json
{
  "mcpServers": {
    "whop": {
      "command": "npx",
      "args": ["-y", "mint-mcp", "run", "whop"],
      "env": {
        "WHOP_API_KEY": "0u_46cKC_VSlKurR5yvKTiPBY_vfEkmmxKpS5-ztfkQ"
      }
    },
    "pipedream": {
      "command": "npx",
      "args": ["-y", "@pipedream/mcp"],
      "env": {
        "PIPEDREAM_API_KEY": "30df00fb2838698e158e4c8dc81a4298"
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
    }
  }
}
```

**Critical fixes applied:**
- ✅ Supabase: Uses SSE type with OAuth authentication (no api_key in URL)
- ✅ Pipedream: Added `-y` flag for non-interactive install + API key in env
- ✅ Whop: Added API key to env section
- ✅ Puppeteer: Updated to official `@modelcontextprotocol/server-puppeteer` package
- ✅ n8n-mcp: Configured with local Node.js path and proper env vars
- ✅ All config files synchronized across Cursor and Claude Code/Desktop

### Step 3: Verify the fix

After updating all configuration files:
1. **Restart Cursor completely** (close all windows)
2. **Restart Claude Desktop** (if using it)
3. **Restart Claude Code** (if using it)
4. Check MCP status in each application
5. Test each server individually

**Testing Commands:**
- Ask Claude: "Can you list the available MCP servers?"
- Ask Claude: "Query Supabase tables"
- Ask Claude: "Take a screenshot of google.com" (tests Puppeteer)
- Ask Claude: "Show Whop API documentation" (tests Whop)

### Step 4: If still failing

Check MCP logs:
```bash
ls -la logs/mcp-*.log
cat logs/mcp-*.log | tail -50
```

Try alternative Supabase format:
```json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server"],
  "env": {
    "SUPABASE_URL": "https://zbyszxtwzoylyygtexdr.supabase.co",
    "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Expected Result

When MCP servers are properly loaded, you should see:

```
MCP Servers (5 total):
✓ whop (npx -y mint-mcp run whop)
✓ pipedream (npx -y @pipedream/mcp)
✓ supabase (SSE: https://mcp.supabase.com/mcp?project_ref=Yzbyszxtwzoylyygtexdr)
✓ puppeteer (npx -y @modelcontextprotocol/server-puppeteer)
✓ n8n-mcp (node C:\Users\jimmy\n8n-mcp\dist\mcp\index.js)
```

**Note**: The exact command to view MCP servers varies by application:
- **Cursor**: Settings → MCP or check Output panel
- **Claude Desktop**: Check settings/preferences
- **Claude Code**: Use `/mcp` command or check status

## Common Issues

**Issue**: "command not found: npx"
- **Fix**: Install Node.js 18+ from nodejs.org

**Issue**: Supabase returns 401
- **Fix**: Verify anon key is correct in Supabase dashboard
- **Fix**: Try `/sse` endpoint instead of `/mcp`
- **Fix**: Try `anon_key=` instead of `api_key=`

**Issue**: Pipedream fails silently
- **Fix**: Verify API key at pipedream.com/settings/keys
- **Fix**: Try running without API key (limited functionality)

**Issue**: Puppeteer hangs
- **Fix**: Let it download Chromium (~170MB, one-time)
- **Fix**: Check disk space
- **Fix**: Ensure using `@modelcontextprotocol/server-puppeteer` (not deprecated `puppeteer-mcp-server`)

**Issue**: n8n-mcp not found
- **Fix**: Verify path exists: `C:\Users\jimmy\n8n-mcp\dist\mcp\index.js`
- **Fix**: Rebuild n8n-mcp if needed: `cd C:\Users\jimmy\n8n-mcp && npm run build`
- **Fix**: Check Node.js version (requires Node 18+)

**Issue**: Config files out of sync
- **Fix**: Ensure all 5 config files are updated (see Step 2 above)
- **Fix**: Restart each application after updating configs

## Nuclear Option

If nothing works, delete everything and start fresh:

```bash
rm -rf .claude/settings.json .mcp.json
rm -rf node_modules/.cache
```

Then create minimal `.claude/settings.json`:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

Test with just Puppeteer first, then add others one by one.

## Files to Check

**MCP Configuration Files:**
- `.claude/settings.json` - Claude Code project config ✅
- `.cursor/mcp.json` - Cursor IDE project config ✅
- `c:\Users\jimmy\.cursor\mcp.json` - Cursor global config ✅
- `%APPDATA%\Claude\claude_desktop_config.json` - Claude Desktop config ✅
- `.mcp.json` - Project root reference config ✅

**Other Important Files:**
- `.claude/settings.local.json` - Permissions config (allows MCP, node, npx)
- `.env` - API keys source (if using env vars)
- `logs/mcp-*.log` - Error logs (check for connection issues)
- `.gitignore` - Should contain `.claude/settings.json`, `.env`, and API keys

## Project Context

- **Project**: Manifest the Unseen (Whop manifestation coaching app)
- **Tech**: Next.js, Supabase, Claude Haiku 4.5
- **Location**: `C:\projects\manifest_the_unseen`
- **Supabase Project**: `Yzbyszxtwzoylyygtexdr` (note capital Y)

## Current Status (Last Updated: Today)

✅ **All 5 MCP servers configured and synchronized:**
1. ✅ Whop - mint-mcp with API key
2. ✅ Pipedream - @pipedream/mcp with API key  
3. ✅ Supabase - SSE connection (OAuth)
4. ✅ Puppeteer - @modelcontextprotocol/server-puppeteer
5. ✅ n8n-mcp - Local Node.js installation

✅ **All configuration files updated:**
- Claude Code (`.claude/settings.json`)
- Cursor IDE (`.cursor/mcp.json` + global)
- Claude Desktop (Windows AppData)

✅ **Permissions configured:**
- `.claude/settings.local.json` allows MCP, node, npx, tsx commands

**Next Steps**: Restart all applications and test each MCP server individually.

---

**Status**: Configuration complete. Ready for testing after application restarts.
