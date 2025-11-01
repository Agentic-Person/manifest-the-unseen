# Tasks Folder - Agent Build Documentation System

This folder contains detailed documentation for every feature/function built by agents during the Manifest the Unseen development.

---

## 📁 Folder Structure

```
tasks/
├── README.md (this file)
├── TASK-TEMPLATE.md
├── agent-1-frontend-lead/
│   └── 001-dashboard-layout-navigation.md 📅
├── agent-2-backend-lead/
│   ├── 001-initialize-nextjs-project.md ✅
│   ├── 002-supabase-database-setup.md ✅
│   ├── 003-whop-oauth-integration.md ✅
│   └── 004-claude-api-integration.md 📅
├── agent-3-journal-meditation-specialist/
│   └── 001-meditation-content-creation.md ❌ (MVP)
└── agent-4-integration-lead/
    └── 001-testing-framework-setup.md ✅
```

**Status Legend:**
- ✅ Complete
- ⏳ In Progress
- 📅 Pending
- 🚫 Blocked
- ❌ Excluded from MVP

---

## 🎯 Purpose

This documentation system serves multiple critical functions:

1. **Continuity Across Sessions**
   - Pick up exactly where you left off
   - No context loss when switching tools or agents
   - Complete paper trail of all development decisions

2. **Knowledge Transfer**
   - New developers can understand what was built and why
   - Senior-level engineer guidance embedded in each task
   - Clear technical rationale for all approaches

3. **Project Management**
   - Track progress granularly
   - Identify blockers immediately
   - Manage dependencies between tasks

4. **Quality Assurance**
   - Acceptance criteria for every task
   - Testing checklists
   - Handoff notes for dependent work

---

## 📋 Task File Format

Each task file follows a standard template (see `TASK-TEMPLATE.md`) with these key sections:

### Header
- **Task ID & Title:** Unique identifier
- **Status:** Current state (Not Started, In Progress, Complete, Blocked)
- **Week/Phase:** Timeline placement
- **Agent:** Which agent owns this task
- **MCP Servers Used:** Required MCP servers

### Core Documentation
- **Description:** What this task accomplishes
- **Technical Approach:** High-level strategy
- **Implementation Steps:** Step-by-step build instructions
- **Code/Files Created:** What was built
- **Testing Checklist:** How to verify completion
- **Dependencies:** What blocks this, what this blocks

### Knowledge Transfer
- **Notes for Junior Developer:** Detailed explanations
  - What was built
  - Why this approach
  - Common pitfalls
  - Future improvements
  - Resources

### Progress Tracking
- **📊 Progress Log:** Dated entries as work progresses
  - What was accomplished
  - Blockers encountered
  - Next steps
  - Time spent each session

- **🏁 Completion Notes:** Final summary when complete
  - What was delivered
  - Deviations from plan
  - Known issues
  - Handoff notes

---

## 🔄 Workflow

### Starting a New Task

1. **Copy TASK-TEMPLATE.md**
   ```bash
   cp tasks/TASK-TEMPLATE.md tasks/agent-X-role/00Y-task-name.md
   ```

2. **Fill in Task Details**
   - Write clear objective
   - Define acceptance criteria
   - List dependencies
   - Create implementation plan

3. **Update agent_builds.md**
   - Add task to agent's section
   - Update phase tables

### During Development

1. **Update Progress Log**
   - Add dated entry when starting work
   - Document decisions made
   - Note blockers immediately
   - Record time spent

2. **Keep agent_builds.md Synced**
   - Update task status (⏳, ✅, etc.)
   - Change progress percentages

### Completing a Task

1. **Fill Completion Notes**
   - List all deliverables
   - Document deviations
   - Note known issues
   - Write handoff notes

2. **Update agent_builds.md**
   - Mark task ✅ Complete
   - Update phase status
   - Record total time

3. **Inform Dependent Tasks**
   - Update dependent task files
   - Provide integration notes

---

## 🤝 Agent Communication Protocol

When **switching agents or tools**:

1. Read `agent_builds.md` first → Get overall project state
2. Read relevant task MD file → Get detailed context
3. Check Progress Log → See what was last done
4. Continue from last entry → Pick up where previous agent left off
5. Update Progress Log → Document what you're doing

When **handing off to another agent**:

1. Update Progress Log → Document current state
2. Note blockers → What's preventing progress
3. Update agent_builds.md → Change task status
4. Create integration notes → Help next agent integrate your work

---

## 📊 Progress Log Best Practices

**Format:**
```markdown
**YYYY-MM-DD HH:MM - [Status Update Title]**
- What was accomplished this session
- Blockers encountered (if any)
- Next steps planned
- Time spent this session: X hours
```

**Example:**
```markdown
**2025-10-31 14:30 - OAuth Callback Implemented**
- Created app/api/auth/callback/whop/route.ts
- Implemented token exchange with Whop API
- Added user creation in Supabase on first login
- Blocker: Need to verify session cookie security settings
- Next steps: Implement auth middleware for protected routes
- Time spent this session: 1.5 hours
```

**Why This Works:**
- Timestamped for exact continuity
- Specific about accomplishments
- Identifies blockers immediately
- Clear next steps for resuming
- Time tracking for project management

---

## 🎨 Naming Conventions

**Task Files:**
- Format: `NNN-task-name-in-kebab-case.md`
- Example: `001-initialize-nextjs-project.md`
- Sequential numbering within each agent folder

**Agent Folders:**
- Format: `agent-N-role-name/`
- Example: `agent-2-backend-lead/`
- Corresponds to agent roles in agent_builds.md

---

## 🔗 Related Files

- **[agent_builds.md](../agent_builds.md)** - Master orchestration document
- **[TODO.md](../TODO.md)** - High-level project status
- **[CLAUDE.md](../CLAUDE.md)** - Project overview and conventions
- **[docs/Core-App-Architecture.md](../docs/Core-App-Architecture.md)** - Technical specifications

---

## 💡 Tips for Effective Documentation

1. **Write for Your Future Self**
   - You won't remember details in 3 months
   - Document the "why" not just the "what"

2. **Update as You Go**
   - Don't wait until the end
   - Progress logs should be real-time

3. **Be Specific**
   - "Fixed auth bug" ❌
   - "Fixed session cookie not persisting by setting sameSite='lax'" ✅

4. **Document Deviations**
   - Plans change - that's normal
   - Record why you deviated from the plan

5. **Think About Handoffs**
   - What would the next person need to know?
   - What would confuse a new developer?

---

## 🚀 Quick Reference

**Check overall project status:**
→ Read `agent_builds.md`

**Start new task:**
→ Copy `TASK-TEMPLATE.md`, fill it out, update `agent_builds.md`

**Continue existing task:**
→ Read task MD file, check Progress Log, add new entry

**Complete task:**
→ Fill Completion Notes, update `agent_builds.md`, notify dependents

**Switch context:**
→ Read `agent_builds.md` + relevant task file + Progress Log

---

### Agent Responsibilities

**Agent 1 - Frontend Lead:**
- Dashboard with burgundy/gold/brown theme
- Horizontal top navigation (NO sidebar)
- Workbook phase interfaces
- AI Mentor chat UI
- Progress tracking visualizations
- Primary MCP Server: Puppeteer (for UI testing)

**Agent 2 - Backend Lead:**
- Next.js project initialization
- Supabase database schema
- Whop OAuth integration
- Claude API integration
- All API routes
- Primary MCP Servers: Whop, Supabase, Pipedream

**Agent 3 - Journal/Meditation Specialist:**
- Meditation content creation (EXCLUDED FROM MVP)
- 4 journal types
- Audio player component
- Tracking systems
- Primary MCP Servers: Supabase, Pipedream

**Agent 4 - Integration Lead:**
- Testing framework setup
- Jest + React Testing Library
- Puppeteer E2E tests
- Basic gamification
- QA and deployment
- Primary MCP Server: Puppeteer (for E2E testing)

---

---

## 📊 Current Phase Status

### Phase 1: Foundation ✅ COMPLETE
- ✅ Task 001: Initialize Next.js project (Agent 2)

### Phase 2: Parallel Backend Foundation ✅ COMPLETE
- ✅ Task 002: Supabase database setup (Agent 2a) - *Manual migration step required*
- ✅ Task 003: Whop OAuth integration (Agent 2b)
- ✅ Task 001: Testing framework setup (Agent 4)

### Phase 3: AI + UI 📅 UPCOMING
- 📅 Task 004: Claude API integration (Agent 2)
- 📅 Task 001: Dashboard layout & navigation (Agent 1)

**Overall Progress:** 4/6 MVP tasks complete (67%)

---

**Last Updated:** 2025-10-31 (Phase 2 Complete)
**System Version:** 1.0 (Enhanced with Progress Logs)
**Maintained By:** Development Team
