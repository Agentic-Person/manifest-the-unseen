# Testing Guide

This document outlines the testing strategy and practices for Manifest the Unseen MVP.

## Overview

The project uses a comprehensive testing approach:

- **Unit Tests**: Jest + React Testing Library for components and utilities
- **Integration Tests**: Jest for API route testing
- **E2E Tests**: Puppeteer MCP for end-to-end user flows

## Unit Tests (Jest + React Testing Library)

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (auto-rerun on changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Structure

Tests are located in the `__tests__` directory, organized by type:

```
__tests__/
├── components/        # Component tests
├── api/              # API route tests
└── lib/              # Utility function tests
```

### Writing Component Tests

Use the custom render function from `@/lib/test-utils`:

```typescript
import { render, screen } from '@/lib/test-utils'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing Best Practices

1. **Test User Behavior, Not Implementation**
   - Focus on what users see and interact with
   - Avoid testing internal component state directly
   - Use accessible queries (getByRole, getByLabelText)

2. **Use Semantic Queries**
   ```typescript
   // Good - tests accessibility and user experience
   screen.getByRole('button', { name: /submit/i })

   // Avoid - brittle and doesn't test accessibility
   screen.getByTestId('submit-button')
   ```

3. **Mock External Services**
   - Always mock Supabase, Whop, and Claude API calls
   - Use Jest mocks or MSW for API mocking
   - Keep tests isolated and fast

4. **Test Error States**
   ```typescript
   it('should display error message on API failure', async () => {
     // Mock API to return error
     mockSupabase.mockRejectedValue(new Error('Network error'))

     render(<MyComponent />)
     await waitFor(() => {
       expect(screen.getByText(/error/i)).toBeInTheDocument()
     })
   })
   ```

## API Integration Tests

### Testing API Routes

API routes are tested using Jest without making real external calls:

```typescript
// Example API test structure
describe('POST /api/journal', () => {
  beforeEach(() => {
    // Mock Supabase client
    jest.mock('@/lib/supabase')
  })

  it('should create a journal entry', async () => {
    // Test implementation
  })

  it('should return 401 for unauthenticated requests', async () => {
    // Test implementation
  })
})
```

### API Testing Guidelines

1. **Mock All External Services**
   - Supabase database calls
   - Whop API requests
   - Claude API interactions
   - ElevenLabs API calls

2. **Test Authentication**
   - Verify protected routes require authentication
   - Test both authenticated and unauthenticated scenarios

3. **Test Error Handling**
   - Database connection failures
   - Invalid input validation
   - Rate limiting
   - Service outages

4. **Verify Response Formats**
   ```typescript
   it('should return correct response format', async () => {
     const response = await POST(request)
     const data = await response.json()

     expect(data).toHaveProperty('id')
     expect(data).toHaveProperty('created_at')
   })
   ```

## E2E Tests (Puppeteer)

### Running E2E Tests

```bash
# Run E2E test suite
pnpm test:e2e
```

### E2E Test Structure

E2E tests are located in the `e2e/` directory:

```
e2e/
├── puppeteer.config.js    # Puppeteer configuration
├── run-tests.js           # Test runner
└── auth-flow.spec.js      # Example test
```

### Implementing E2E Tests

E2E tests are implemented using the **Puppeteer MCP server**:

1. Ensure the Puppeteer MCP server is running
2. Use Puppeteer MCP tools to navigate and interact with the app
3. Add assertions to verify user flows

### E2E Testing Guidelines

1. **Test Critical User Flows**
   - Authentication (OAuth login)
   - User onboarding
   - Workbook phase completion
   - Journal entry creation
   - AI mentor interactions

2. **Test Across User States**
   - New users (onboarding)
   - Returning users
   - Users with completed phases

3. **Test Data Persistence**
   - Verify data saves correctly
   - Check data loads after page refresh
   - Validate cross-session persistence

4. **Example Critical Flows to Test**
   ```javascript
   // Authentication flow
   - Navigate to app
   - Click login
   - Complete Whop OAuth
   - Verify user profile creation
   - Check redirect to dashboard

   // Workbook flow
   - Navigate to workbook
   - Complete an exercise
   - Verify progress saved
   - Check phase unlock logic

   // Journal flow
   - Create journal entry
   - Verify AI analysis appears
   - Check entry persists
   ```

## Test Coverage Goals

Aim for the following coverage targets:

- **Components**: 80%+ coverage
- **API Routes**: 90%+ coverage
- **Utility Functions**: 95%+ coverage
- **Critical User Flows**: 100% E2E coverage

## Continuous Integration

Tests will run automatically on:

- Pull request creation
- Commits to main branch
- Pre-deployment checks

## Mock Data & Test Fixtures

### Environment Variables

All environment variables are mocked in `jest.setup.js`:

```javascript
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
// ... etc
```

### Creating Test Fixtures

Store reusable test data in `__tests__/fixtures/`:

```typescript
// __tests__/fixtures/users.ts
export const mockUser = {
  id: 'test-user-id',
  whop_user_id: 'whop_123',
  current_phase: 1,
  signal_strength_score: 50,
}
```

## Debugging Tests

### Running Individual Tests

```bash
# Run a specific test file
pnpm test __tests__/components/example.test.tsx

# Run tests matching a pattern
pnpm test --testNamePattern="should render correctly"
```

### Debugging in VS Code

Add this to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Using screen.debug()

```typescript
import { render, screen } from '@/lib/test-utils'

it('should render component', () => {
  render(<MyComponent />)
  screen.debug() // Prints the current DOM to console
})
```

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"

**Solution**: Ensure `moduleNameMapper` in `jest.config.js` is correct:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### Issue: "TextEncoder is not defined"

**Solution**: Add to `jest.setup.js`:

```javascript
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
```

### Issue: Tests timeout

**Solution**: Increase timeout or ensure async operations complete:

```typescript
jest.setTimeout(10000) // 10 seconds

// Or per-test
it('slow test', async () => {
  // ...
}, 15000) // 15 seconds
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Puppeteer Documentation](https://pptr.dev/)

## Next Steps

1. Write tests for each new component as it's built
2. Add API route tests as endpoints are created
3. Implement E2E tests for critical user flows
4. Set up CI/CD pipeline with automated testing
5. Monitor and maintain test coverage targets
