# E2E Testing with Puppeteer MCP

This directory contains end-to-end tests implemented using the **Puppeteer MCP Server**.

## Overview

E2E tests verify complete user workflows by automating browser interactions. Unlike unit tests that test individual functions, E2E tests ensure the entire application works correctly from the user's perspective.

## Prerequisites

### 1. Puppeteer MCP Server
The Puppeteer MCP server must be connected and running. Verify in your Claude Code or Cursor IDE settings.

### 2. Development Server
Start the Next.js development server:

```bash
pnpm dev
```

The app will be available at http://localhost:3000

### 3. Test Environment Variables
Environment variables are mocked in `jest.setup.js` for unit tests, but E2E tests run against the actual app with real (or test) environment variables.

## Running E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run all tests (unit + E2E)
pnpm test
```

## Test Structure

```
e2e/
├── README.md              # This file
├── puppeteer.config.js    # Puppeteer configuration
├── run-tests.js           # Test runner script
├── auth-flow.spec.js      # Authentication flow tests
└── screenshots/           # Visual regression screenshots (generated)
```

## Implementing Tests with Puppeteer MCP

### Current Status

The E2E tests are **structured and documented** but use console.log placeholders. To implement actual browser automation, use the **Puppeteer MCP tools**.

### Example: Implementing a Basic Navigation Test

Here's how to convert a placeholder test into a real Puppeteer MCP test:

**Before (Placeholder):**
```javascript
it('should load the home page successfully', async () => {
  console.log('TODO: Implement with Puppeteer MCP - Navigate to', BASE_URL)
  console.log('Expected: Page title "Manifest the Unseen"')
})
```

**After (Implemented with Puppeteer MCP):**

To implement this, you would:

1. **Use Puppeteer MCP to navigate:**
   - Tool: `puppeteer_navigate`
   - Parameters: `{ url: 'http://localhost:3000' }`

2. **Wait for page load:**
   - Tool: `puppeteer_wait_for_selector`
   - Parameters: `{ selector: 'h1' }`

3. **Get page content:**
   - Tool: `puppeteer_get_content`
   - Verify text includes "Manifest the Unseen"

4. **Take screenshot (optional):**
   - Tool: `puppeteer_screenshot`
   - Parameters: `{ path: 'e2e/screenshots/home-page.png' }`

### Puppeteer MCP Tools Reference

When implementing tests, use these Puppeteer MCP capabilities:

- **Navigation**: Navigate to URLs
- **Selectors**: Find elements by CSS selector, text, or XPath
- **Actions**: Click, type, scroll, hover
- **Assertions**: Get page content, check element visibility
- **Screenshots**: Capture visual state
- **Cookies**: Set/get cookies for authentication
- **Network**: Monitor requests, mock responses

## Test Scenarios

### 1. Landing Page Tests
✅ **Status**: Structured, ready for implementation

**Tests:**
- Load home page successfully
- Display correct branding and content

**Implementation priority**: HIGH (simple, validates basic functionality)

### 2. Protected Routes Tests
✅ **Status**: Structured, ready for implementation

**Tests:**
- Redirect unauthenticated users from /customer routes
- Protect all customer-facing pages

**Implementation priority**: HIGH (critical security validation)

### 3. OAuth Callback Flow
⚠️ **Status**: Complex, requires Whop credentials or mock

**Tests:**
- Handle Whop OAuth callback
- Create user profile after authentication

**Implementation priority**: MEDIUM (complex setup required)

### 4. Session Management
⚠️ **Status**: Depends on authentication implementation

**Tests:**
- Maintain session across navigation
- Handle logout correctly

**Implementation priority**: MEDIUM (depends on OAuth tests)

### 5. Visual Regression
✅ **Status**: Ready for baseline capture

**Tests:**
- Capture screenshots of all major pages

**Implementation priority**: LOW (nice-to-have for MVP)

## Implementation Workflow

### Phase 1: Basic Navigation (Start Here)
1. Start dev server: `pnpm dev`
2. Use Puppeteer MCP to navigate to http://localhost:3000
3. Verify page loads and displays expected content
4. Take baseline screenshot

### Phase 2: Protected Routes
1. Test navigation to protected routes
2. Verify redirect behavior
3. Document authentication requirements

### Phase 3: Authentication Flow (Complex)
1. Set up Whop OAuth test credentials OR create mock
2. Implement login flow test
3. Verify session creation
4. Test user profile creation in Supabase

### Phase 4: Full User Flows
1. Complete workbook exercise
2. Create journal entry
3. Interact with AI mentor
4. Navigate between all pages

## Example: Converting Placeholder to Real Test

Let's implement the "should load home page successfully" test:

### Step 1: Start Dev Server
```bash
pnpm dev
```

### Step 2: Use Puppeteer MCP (via Claude Code)

Ask Claude Code:
> "Use Puppeteer MCP to navigate to http://localhost:3000 and verify the page contains 'Manifest the Unseen'"

Claude will use the Puppeteer MCP tools to:
1. Launch browser
2. Navigate to URL
3. Get page content
4. Verify text is present
5. Take screenshot

### Step 3: Update Test File

Once you've verified the test works with Puppeteer MCP, update the test file to document the working implementation:

```javascript
it('should load the home page successfully', async () => {
  // Implemented with Puppeteer MCP
  // Verified: Page loads at http://localhost:3000
  // Verified: Title includes "Manifest the Unseen"
  // Verified: Content includes "Initializing your manifestation journey..."
  // Screenshot: e2e/screenshots/home-page.png

  expect(true).toBe(true) // Placeholder until we integrate Puppeteer MCP directly into Jest
})
```

## Integration with Jest

Currently, the E2E tests are structured in Jest but use console.log placeholders. There are two approaches to integrate Puppeteer MCP:

### Approach 1: Manual Testing (Current)
- Use Puppeteer MCP via Claude Code interface
- Manually verify each test scenario
- Document results in test files
- Keep Jest tests as documentation/checklist

### Approach 2: Direct Integration (Future)
- Create Puppeteer MCP client library
- Call MCP tools directly from Jest tests
- Automate test execution
- Requires MCP client SDK

For MVP, **Approach 1** is recommended: use Puppeteer MCP manually to verify critical flows, document results, and use Jest tests as a checklist.

## Visual Regression Testing

### Baseline Screenshots

Capture baseline screenshots of all major pages:

```
e2e/screenshots/
├── home-page.png
├── dashboard.png
├── workbook-phase-1.png
├── journal-entry.png
├── mentor-chat.png
└── profile-page.png
```

### Capturing Baselines

Use Puppeteer MCP to:
1. Navigate to each page
2. Wait for content to load
3. Take screenshot
4. Save to `e2e/screenshots/`

### Comparing Screenshots

For visual regression:
1. Capture baseline (first time)
2. Make UI changes
3. Capture new screenshot
4. Compare images visually
5. Update baseline if changes are intentional

## Best Practices

### 1. Wait for Elements
Always wait for elements to be visible before interacting:
- Don't use arbitrary `sleep()` delays
- Use Puppeteer's `waitForSelector()` instead
- This makes tests more reliable

### 2. Use Semantic Selectors
Prefer semantic selectors over brittle ones:
- ✅ Good: `'[aria-label="Submit"]'`
- ✅ Good: `'text=Manifest the Unseen'`
- ❌ Bad: `'div > div > button:nth-child(3)'`

### 3. Clean Test Data
- Reset database state between tests (if needed)
- Use test-specific user accounts
- Don't rely on specific data existing

### 4. Test Real User Flows
Focus on what users actually do:
- ✅ "User completes phase 1 exercise"
- ❌ "API endpoint returns 200"

### 5. Handle Async Properly
All Puppeteer operations are async:
- Always `await` Puppeteer MCP calls
- Use proper error handling
- Consider timeouts

## Debugging E2E Tests

### Enable Headless: false
Run browser in visible mode (if Puppeteer MCP supports it):
```javascript
launch: {
  headless: false  // See the browser
}
```

### Take Screenshots on Failure
Capture state when tests fail:
```javascript
afterEach(async () => {
  if (testFailed) {
    await page.screenshot({ path: 'failure.png' })
  }
})
```

### Use Browser DevTools
- Inspect elements
- Check console errors
- Monitor network requests
- View cookies/storage

## Next Steps

### Immediate (MVP)
1. ✅ Testing framework structure (DONE)
2. 🔄 Use Puppeteer MCP to verify home page loads
3. 🔄 Test protected route redirects
4. 🔄 Capture baseline screenshots

### Post-MVP
1. Implement OAuth flow testing
2. Add session management tests
3. Test all four pillars (Workbook, Journal, Mentor, Meditations)
4. Set up automated visual regression
5. Integrate with CI/CD pipeline

## Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Puppeteer MCP Server](https://github.com/anthropics/mcp-servers)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Visual Regression Testing](https://github.com/garris/BackstopJS)

## Questions?

If you're implementing these tests and need guidance:

1. Check the test file comments for expected behavior
2. Refer to the Puppeteer MCP documentation
3. Start with simple navigation tests before complex flows
4. Ask Claude Code to help implement tests using Puppeteer MCP tools
