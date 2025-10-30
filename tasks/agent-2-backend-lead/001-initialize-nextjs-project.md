# Task 001 - Initialize Next.js Project with TypeScript

**Status:** [X] In Progress

**Week/Phase:** Week 1

**Agent:** Agent 2 - Backend Lead

**MCP Servers Used:**
- [ ] Whop MCP
- [ ] Supabase MCP
- [ ] Pipedream MCP
- [ ] Puppeteer MCP

---

### Description

Set up the foundational Next.js project with TypeScript, Tailwind CSS, and the App Router. This is the critical first step that all other development depends on.

---

### Technical Approach

Use `pnpm create next-app` with TypeScript and App Router flags. Configure for Whop platform integration with proper directory structure for multi-tenant architecture.

---

### Implementation Steps

1. ✅ Create Next.js project with TypeScript and Tailwind
2. ✅ Configure directory structure (app/, components/, lib/)
3. ⏳ Install core dependencies (Whop SDK, Supabase, Claude SDK)
4. ⏳ Set up environment variables template
5. ⏳ Configure tailwind.config for Tibetan monk aesthetic
6. ⏳ Create initial layout with Frosted UI

---

### Code/Files Created

**Project Structure:**
```
manifest_the_unseen/
├── app/
│   ├── layout.tsx (root layout)
│   ├── page.tsx (landing page)
│   └── globals.css (Tailwind + custom styles)
├── components/
│   └── ui/ (Frosted UI components)
├── lib/
│   ├── supabase.ts (database client)
│   ├── claude.ts (AI integration)
│   └── whop.ts (Whop SDK utilities)
├── public/
├── .env.local.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

### Testing Checklist

- [X] Project initializes successfully
- [ ] pnpm dev starts without errors
- [ ] TypeScript compiles without errors
- [ ] Tailwind classes work
- [ ] Environment variables load correctly

---

### Dependencies

**Blocked by:**
- None (first task)

**Blocks:**
- Task 002 (Supabase Setup)
- Task 003 (Whop OAuth)
- All Agent 1 tasks
- All Agent 3 tasks

**External Dependencies:**
- Node.js 18+
- pnpm package manager

---

### Notes for Junior Developer

**What was built:**
This task establishes the entire project foundation. We're using Next.js 14+ with the App Router (not Pages Router - important!). The App Router gives us better server-side rendering, streaming, and nested layouts.

**Why this approach:**
- **Next.js**: Required by Whop platform, provides SSR and API routes
- **TypeScript**: Type safety prevents bugs, especially with complex data models
- **Tailwind CSS**: Rapid UI development, easy to customize for Tibetan aesthetic
- **pnpm**: Faster than npm, better monorepo support for future scaling

**Project Structure Decisions:**
- `app/` directory contains all routes (App Router pattern)
- `components/` for reusable UI components (keep them dumb/presentational)
- `lib/` for utilities and API clients (keep business logic here)

**Tibetan Monk Aesthetic Configuration:**
In `tailwind.config.ts`, we'll define custom colors:
```typescript
colors: {
  monk: {
    stone: '#8B7355',      // Warm stone brown
    sand: '#D4C5B0',       // Sandy beige
    sage: '#9CAF88',       // Muted sage green
    clay: '#A0826D',       // Terracotta clay
    ash: '#78716C',        // Warm gray
  }
}
```

**Common pitfalls:**
1. Don't mix App Router and Pages Router patterns
2. Keep server components (default) unless you need client interactivity
3. Environment variables need NEXT_PUBLIC_ prefix for client-side access
4. Whop requires specific routing patterns - follow their docs

**Future improvements:**
- Add bundle analyzer to monitor bundle size
- Set up absolute imports (@/ instead of ../../../)
- Configure ESLint and Prettier rules
- Add Husky for pre-commit hooks

**Resources:**
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Whop Developer Docs](https://dev.whop.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

### Completion Notes

**Date Completed:** [To be filled when complete]

**Time Spent:** [To be tracked]

**Final Status:** In Progress

**Handoff Notes:**
Once this is complete, Agent 2 can proceed with Supabase setup (Task 002) and Whop OAuth (Task 003) in parallel. Agent 1 can begin working on UI components once the basic structure is ready.
