# Task 001 - Testing Framework Setup

**Status:** [ ] Not Started - REQUIRES PUPPETEER MCP SERVER

**Week/Phase:** Week 1-2

**Agent:** Agent 4 - Integration & Polish Lead

**MCP Servers Used:**
- [ ] Whop MCP
- [ ] Supabase MCP
- [ ] Pipedream MCP
- [X] Puppeteer MCP - **REQUIRED**

---

### Description

Set up comprehensive testing framework using Puppeteer MCP for end-to-end testing, Jest for unit tests, and React Testing Library for component tests. Establish testing standards and CI/CD pipeline foundations.

---

### Technical Approach

Use **Puppeteer MCP Server** to create browser-based E2E tests. Set up Jest and React Testing Library for unit/component tests. Create test utilities and helper functions.

---

### Implementation Steps

1. Install testing dependencies (Jest, React Testing Library, Puppeteer)
2. Configure Jest for Next.js
3. Set up Puppeteer MCP connection for E2E tests
4. Create test utilities folder and helpers
5. Write example tests for each test type
6. Set up test scripts in package.json
7. Create testing documentation for other agents
8. (Future) Configure GitHub Actions for CI/CD

---

### Code/Files Created

**Files:**
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup file
- `__tests__/` - Test directory structure
- `__tests__/utils/test-helpers.ts` - Shared test utilities
- `__tests__/e2e/` - Puppeteer E2E tests
- `__tests__/unit/` - Unit tests
- `__tests__/components/` - Component tests
- `testing-guide.md` - Documentation for team

**Package.json Scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "jest --config jest.e2e.config.js",
    "test:coverage": "jest --coverage"
  }
}
```

**Jest Configuration:**

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**Example E2E Test (Puppeteer MCP):**

```typescript
// __tests__/e2e/auth-flow.test.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/customer/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow authenticated users to access dashboard', async ({ page }) => {
    // Mock authentication
    await page.goto('/login');
    // ... login flow using Puppeteer MCP
    await page.goto('/customer/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
```

**Example Component Test:**

```typescript
// __tests__/components/Sidebar.test.tsx
import { render, screen } from '@testing-library/react';
import Sidebar from '@/components/navigation/Sidebar';

describe('Sidebar', () => {
  it('renders navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('AI Mentor')).toBeInTheDocument();
    expect(screen.getByText('Workbook')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Meditations')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Sidebar />);
    const activeLink = screen.getByText('Home').closest('a');
    expect(activeLink).toHaveClass('bg-monk-stone');
  });
});
```

---

### Testing Checklist

- [ ] Jest configured and running
- [ ] React Testing Library set up
- [ ] Puppeteer MCP connected for E2E tests
- [ ] Test utilities created
- [ ] Example tests written for each type
- [ ] Test scripts work (npm test)
- [ ] Coverage reporting enabled
- [ ] Documentation created for team

---

### Dependencies

**Blocked by:**
- Task 001 (Agent 2 - Next.js initialization)
- Puppeteer MCP Server must be connected

**Blocks:**
- Quality assurance for all features
- E2E testing of user flows
- Visual regression testing

**External Dependencies:**
- `jest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@playwright/test` (Puppeteer alternative)
- Puppeteer MCP Server

---

### Notes for Junior Developer

**What needs to be built:**
A robust testing framework that catches bugs before users do. Three types of tests:

1. **Unit Tests:** Test individual functions in isolation
2. **Component Tests:** Test React components
3. **E2E Tests:** Test complete user flows (login → dashboard → workbook)

**Why Three Test Types:**

- **Unit tests:** Fast, catch logic bugs
- **Component tests:** Verify UI behavior
- **E2E tests:** Validate entire user experience

**Puppeteer MCP for E2E:**
Puppeteer MCP allows us to:
- Automate browser interactions
- Test across different browsers
- Take screenshots for visual regression
- Test mobile responsiveness
- Validate accessibility

**Test-Driven Development (TDD):**
Ideally, write tests BEFORE writing features:
1. Write failing test
2. Write minimum code to pass test
3. Refactor
4. Repeat

This ensures features are testable and bug-free.

**Common pitfalls:**
1. **No tests:** "I'll add tests later" = tests never get added
2. **Testing implementation details:** Test behavior, not internal state
3. **Flaky E2E tests:** Use proper waits, not timeouts
4. **No test data cleanup:** Tests should be isolated and repeatable
5. **Skipping edge cases:** Test error states, empty states, loading states

**Testing Standards to Enforce:**
- All new features must have tests
- Maintain 80%+ code coverage
- E2E tests for critical user flows
- Visual regression tests for UI changes

**Future improvements:**
- Set up CI/CD pipeline (GitHub Actions)
- Add visual regression testing (Percy, Chromatic)
- Performance testing (Lighthouse CI)
- Accessibility testing (axe-core)
- Load testing for APIs

**Resources:**
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev/)

---

### Completion Notes

**Date Completed:** [Waiting for Puppeteer MCP Server]

**Time Spent:** [To be tracked]

**Final Status:** Not Started - Waiting for MCP Server connection

**Handoff Notes:**
⚠️ **CRITICAL:** This task REQUIRES Puppeteer MCP Server for E2E testing.

Once Puppeteer MCP is connected:
1. Configure Puppeteer with MCP
2. Write baseline E2E tests
3. Document testing patterns for team
4. Set up visual regression baseline screenshots

This enables quality assurance for all subsequent features.
