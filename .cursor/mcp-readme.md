# Cursor IDE MCP Configuration

This directory contains the Model Context Protocol (MCP) server configuration for Cursor IDE.

## About This Configuration

This `mcp.json` file mirrors the configuration in the root directory and enables Cursor to access the same MCP servers:

- **Whop** - Whop commerce platform API documentation and integration
- **Pipedream** - Workflow automation and API orchestration
- **Supabase** - Direct database operations and queries
- **Puppeteer** - Browser automation and web testing

## How to Enable MCP in Cursor

### Option 1: Using This Project Configuration

Cursor should automatically detect the `.cursor/mcp.json` file in this project directory when you open it.

### Option 2: Global Cursor Configuration

If you want these MCP servers available in all Cursor projects:

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Search for "MCP"
3. Configure the MCP servers in your global Cursor settings

### Environment Variables

The configuration uses environment variables from `.env.local`:
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `PIPEDREAM_API_KEY` - Your Pipedream API key

Make sure these are set in your `.env.local` file in the project root.

## Verifying MCP Servers Are Working

After restarting Cursor, you should see MCP-related features in:
- The command palette (search for MCP commands)
- AI chat context (MCP resources will be available)
- Composer and other AI features

## Troubleshooting

**Issue**: MCP servers not loading
- **Solution**: Restart Cursor completely
- **Solution**: Check that Node.js 18+ is installed
- **Solution**: Verify `.env.local` has the required API keys

**Issue**: Permission errors
- **Solution**: Ensure npx can execute packages (check Node.js installation)

**Issue**: Supabase or Pipedream authentication errors
- **Solution**: Verify API keys in `.env.local` are correct and not expired

## Reference Documentation

- [MCP Setup Guide](../MCP_SETUP_GUIDE.md) - Complete setup instructions for all MCP servers
- [Cursor Documentation](https://cursor.sh/docs) - Official Cursor IDE documentation
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP specification and documentation

## Note

This configuration is identical to the root `mcp.json` file. Any changes should be synchronized between both files to maintain consistency across Claude Code and Cursor IDE.
