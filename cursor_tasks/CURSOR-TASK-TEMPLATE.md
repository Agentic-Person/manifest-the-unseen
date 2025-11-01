# Cursor Task Template

**Copy this template for new Cursor agent tasks**

---

## Task ID: [XXX] - [Task Title]

**Status:** 
- [ ] Not Started
- [ ] In Progress
- [X] Finished - Code complete, ready for integration
- [X] Integrated - Connected to backend/APIs, data flows correctly
- [X] Tested - Unit tests, integration tests, manual testing complete

**Week/Phase:** Week X

**Agent:** Cursor Agent X - [Role]

**MCP Servers Used:**
- [ ] Canva MCP (MANDATORY for design work)
- [ ] Supabase MCP (MANDATORY for database operations)
- [ ] Whop MCP (MANDATORY for platform operations)
- [ ] Puppeteer MCP (MANDATORY for testing)

**CRITICAL**: Use MCP servers for all operations. CLI tools should ONLY be used if MCP proves significantly more efficient.

---

### Description

[Clear description of what needs to be built]

---

### Technical Approach

[High-level technical strategy]

**MCP Integration:**
- How this task uses Canva MCP (if applicable)
- How this task uses Supabase MCP (if applicable)
- How this task uses Whop MCP (if applicable)

---

### Implementation Steps / Todo List

- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]
- [ ] Step 4: [Description]

---

### Code/Files Created

**Files:**
- `path/to/file.tsx` - [Purpose]
- `path/to/component.tsx` - [Purpose]

**Key Components/Functions:**
- `ComponentName` - [What it renders]
- `functionName()` - [What it does]

**MCP Usage:**
- [How Canva MCP was used]
- [How Supabase MCP was used]
- [How Whop MCP was used]

---

### Testing Checklist

- [ ] Component renders correctly
- [ ] User interactions work as expected
- [ ] Data integration with backend works
- [ ] Error handling implemented
- [ ] Edge cases covered
- [ ] Visual regression tests (Puppeteer MCP)
- [ ] Performance acceptable
- [ ] Accessibility checked

---

### Dependencies

**Blocked by:**
- Claude Code Task XXX must be complete first
- Cursor Task YYY must be complete first

**Blocks:**
- Cursor Task ZZZ depends on this

**External Dependencies:**
- Package: `package-name@version`
- API: Service name (via MCP)
- Design: Canva design reference (if applicable)

---

### Senior Engineer Notes

#### What to Build

[Detailed explanation of what needs to be implemented]

#### Why This Approach

[Technical rationale for decisions]

#### How to Build It

1. [Step-by-step guidance]
2. [MCP usage instructions]
3. [Integration points]

#### MCP Usage Details

**Canva MCP:**
- [Specific Canva MCP commands/functions used]
- [Design assets created]
- [Design specifications exported]

**Supabase MCP:**
- [Specific Supabase MCP queries used]
- [Data fetching patterns]
- [Real-time subscriptions (if applicable)]

**Whop MCP:**
- [Specific Whop MCP operations used]
- [User data queries]
- [Platform integration points]

#### Common Pitfalls

[Things to watch out for]

#### Integration Points

- Backend API: `/api/[endpoint]`
- Database tables: `table_name`
- Design reference: `cursor_tasks/cursor-agent-4-canva-designs/XXX-phase-X-graphics.md`

#### Canva Design Reference

[Link to Canva design specs if applicable]
- Design file: `cursor_tasks/cursor-agent-4-canva-designs/XXX-phase-X-graphics.md`
- Color palette: [Reference]
- Typography: [Reference]
- Component specs: [Reference]

---

### 📊 Progress Log

**Instructions:** Add dated entries as you work. This creates a paper trail for continuity.

**Format:**
```markdown
**YYYY-MM-DD HH:MM - [Status Update Title]**
- What was accomplished this session
- MCP usage: [Which MCPs were used and how]
- Blockers encountered (if any)
- Next steps planned
- Time spent this session: X hours
```

**Example:**
```markdown
**2025-10-31 14:30 - Wheel of Life Component Created**
- Built interactive circular chart component using Canvas API
- MCP usage: Used Canva MCP to fetch design specifications for color palette and typography
- MCP usage: Used Supabase MCP to query user_profiles table for progress data
- Integrated with backend API: /api/workbook/progress
- Blocker: Need to verify Supabase MCP query syntax for JSONB data
- Next steps: Add drag-to-rate functionality, connect to progress tracking
- Time spent this session: 2 hours
```

---

**[Add your progress entries below]**

---

### 🏁 Completion Notes

**Date Completed:** YYYY-MM-DD

**Time Spent:** X hours total

**Final Status:** 
- [X] Finished
- [X] Integrated
- [X] Tested

**What Was Delivered:**
[List of deliverables]

**MCP Usage Summary:**
- Canva MCP: [What was done]
- Supabase MCP: [What was done]
- Whop MCP: [What was done]

**Deviations from Plan:**
[Any changes to original approach]

**Known Issues:**
[Technical debt or limitations]

**Handoff Notes:**
[Critical info for dependent tasks or future maintainers]

