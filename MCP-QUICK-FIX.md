# MCP Quick Fix Guide - Feed This to Claude

**URGENT: MCP servers not working? Copy this entire document and paste it into a new Claude session.**

## Problem Summary

The 4 MCP servers (Whop, Pipedream, Supabase, Puppeteer) are configured but crashing or not connecting.

## Root Causes Found (RESOLVED)

1. **Supabase MCP**: ✅ FIXED - Was using wrong auth method (anon_key instead of OAuth)
   - Correct: `https://mcp.supabase.com/mcp?project_ref=PROJECT_ID` (OAuth will prompt on first use)
   - Wrong: Adding `&api_key=` or `&anon_key=` to URL

2. **Pipedream MCP**: ✅ FIXED - Missing `-y` flag for auto-install
   - Correct: `npx -y @pipedream/mcp`
   - Wrong: `npx @pipedream/mcp` (requires manual confirmation)

3. **Whop MCP**: ✅ Working - Uses mint-mcp with correct structure
4. **Puppeteer MCP**: ✅ Working - Standard npx installation

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
# Test Puppeteer
npx -y puppeteer-mcp-server --version

# Test Whop (mint-mcp)
npx -y mint-mcp --version

# Test Pipedream
PIPEDREAM_API_KEY=30df00fb2838698e158e4c8dc81a4298 npx @pipedream/mcp --version

# Test Supabase URL (check multiple formats)
curl "https://mcp.supabase.com/sse?project_ref=zbyszxtwzoylyygtexdr&anon_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 2: Fix .claude/settings.json (ALREADY DONE)

✅ **The correct configuration is now in place:**

```json
{
  "mcpServers": {
    "whop": {
      "command": "npx",
      "args": ["-y", "mint-mcp", "run", "whop"]
    },
    "pipedream": {
      "command": "npx",
      "args": ["-y", "@pipedream/mcp"],
      "env": {
        "PIPEDREAM_API_KEY": "30df00fb2838698e158e4c8dc81a4298"
      }
    },
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=zbyszxtwzoylyygtexdr"
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "puppeteer-mcp-server"]
    }
  }
}
```

**Critical fixes applied:**
- ✅ Supabase: Uses OAuth authentication (no anon_key in URL)
- ✅ Pipedream: Added `-y` flag for non-interactive install
- ✅ All: Proper npx command structure

### Step 3: Verify the fix

After updating `.claude/settings.json`:
1. Exit Claude completely
2. Restart Claude in the project directory
3. Run `/mcp` command
4. All 4 servers should show as connected

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

When you run `/mcp`, you should see:

```
MCP Servers:
✓ puppeteer (npx -y puppeteer-mcp-server)
✓ whop (npx -y mint-mcp run whop)
✓ pipedream (npx -y @pipedream/mcp)
✓ supabase (SSE: https://mcp.supabase.com/sse)
```

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
      "args": ["-y", "puppeteer-mcp-server"]
    }
  }
}
```

Test with just Puppeteer first, then add others one by one.

## Files to Check

- `.claude/settings.json` - Primary MCP config
- `.env` - API keys source
- `logs/mcp-*.log` - Error logs
- `.gitignore` - Should contain `.claude/settings.json` and `.env`

## Project Context

- **Project**: Manifest the Unseen (Whop manifestation coaching app)
- **Tech**: Next.js, Supabase, Claude Haiku 4.5
- **Location**: `C:\projects\manifest_the_unseen`
- **Supabase Project**: zbyszxtwzoylyygtexdr

---

**TO CLAUDE: After fixing, update this document with what actually worked so next time is faster.**
