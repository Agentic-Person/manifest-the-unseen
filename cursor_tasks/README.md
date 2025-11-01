# Cursor Tasks Folder - Feature Implementation System

This folder contains detailed documentation for every feature built by **Cursor agents** during the Manifest the Unseen development. This system runs in parallel with the `tasks/` folder (Claude Code agents) but focuses on **feature implementation** rather than foundation.

---

## 📁 Folder Structure

```
cursor_tasks/
├── README.md (this file)
├── CURSOR-TASK-TEMPLATE.md
├── cursor-agent-1-workbook-ui/
│   ├── 001-phase-1-exercises.md
│   ├── 002-phase-2-exercises.md
│   ├── 003-phase-3-exercises.md
│   ├── 004-phase-4-exercises.md
│   ├── 005-phase-5-exercises.md
│   ├── 006-phase-6-exercises.md
│   ├── 007-phase-7-exercises.md
│   ├── 008-phase-8-exercises.md
│   ├── 009-phase-9-exercises.md
│   └── 010-phase-10-exercises.md
├── cursor-agent-2-journaling-ui/
│   ├── 001-freeform-journal.md
│   ├── 002-guided-journal.md
│   └── 003-scripting-journal.md
├── cursor-agent-3-ai-mentor-ui/
│   ├── 001-chat-interface.md
│   └── 002-streaming-responses.md
└── cursor-agent-4-canva-designs/
    ├── 001-workbook-design-system.md
    ├── 002-phase-1-graphics.md
    ├── 003-phase-2-graphics.md
    ├── 004-phase-3-graphics.md
    ├── 005-phase-4-graphics.md
    ├── 006-phase-5-graphics.md
    ├── 007-phase-6-graphics.md
    ├── 008-phase-7-graphics.md
    ├── 009-phase-8-graphics.md
    ├── 010-phase-9-graphics.md
    └── 011-asset-export.md
```

**Status Legend:**
- [ ] Not Started
- [ ] In Progress
- [X] Finished - Code complete, ready for integration
- [X] Integrated - Connected to backend/APIs, data flows correctly
- [X] Tested - Unit tests, integration tests, manual testing complete

---

## 🎯 Purpose

This documentation system serves multiple critical functions:

1. **Feature Implementation Tracking**
   - Track all 30 workbook exercises individually
   - Monitor journaling UI components
   - Track AI mentor chat interface development
   - Document Canva design workflow

2. **MCP Server Integration**
   - Mandatory use of Canva MCP for all design work
   - Mandatory use of Supabase MCP for all database operations
   - Mandatory use of Whop MCP for platform operations
   - Document MCP usage patterns and best practices

3. **Clear Separation from Foundation**
   - Cursor agents build features ON TOP of Claude Code's foundation
   - No overlap with `tasks/` folder responsibilities
   - Features depend on foundation APIs and database schema

4. **Status Tracking**
   - Track progress through: Not Started → In Progress → Finished → Integrated → Tested
   - Clear visibility into what's ready for integration
   - Identify blockers and dependencies

---

## 🔄 Relationship to Claude Code Tasks

### Claude Code (tasks/) - Foundation Layer
- **Agent 1**: Dashboard layout, navigation structure, basic UI components
- **Agent 2**: Next.js init, Supabase schema (via Supabase MCP), OAuth (via Whop MCP), API routes, Claude API integration
- **Agent 3**: REMOVED (meditation)
- **Agent 4**: Testing framework setup, infrastructure

### Cursor (cursor_tasks/) - Feature Layer
- **Cursor Agent 1**: Workbook exercise UI components (30 exercises) - **MUST USE Canva MCP** for design references
- **Cursor Agent 2**: Journaling UI (3 types) - **MUST USE Supabase MCP** for data operations
- **Cursor Agent 3**: AI Mentor chat UI and streaming - **MUST USE Supabase MCP** for conversation history
- **Cursor Agent 4**: Canva MCP design workflow - **MUST USE Canva MCP** exclusively for all design work

**Key Difference**: Claude Code builds the foundation (APIs, database, auth). Cursor builds the features (UI components, interactions, visualizations).

---

## 🚨 Mandatory MCP Server Usage

**CRITICAL**: All Cursor agents MUST use the configured MCP servers. CLI tools should ONLY be used if MCP proves significantly more efficient (rare exception).

### Frontend/Design Work
- **Canva MCP**: MANDATORY for all workbook design creation
  - Use Canva MCP to read Canva App UI Kit documentation
  - Use Canva MCP to create design templates for workbook exercises
  - Use Canva MCP to generate visual design specifications
  - Export design assets via Canva MCP

### Backend/Database Work
- **Supabase MCP**: MANDATORY for all database operations
  - Query execution (DO NOT use Supabase CLI)
  - Real-time subscriptions
  - Table management
  - Data fetching for UI components

### Platform Integration
- **Whop MCP**: MANDATORY for all Whop platform operations
  - User data queries
  - Membership verification
  - Product access checks

### Testing
- **Puppeteer MCP**: MANDATORY for browser automation
  - Screenshot generation
  - UI testing
  - Visual regression testing

---

## 📋 Task File Format

Each task file follows `CURSOR-TASK-TEMPLATE.md` with these key sections:

### Header Section
- Task ID & Title
- Status markers: [ ] Not Started / [ ] In Progress / [X] Finished / [X] Integrated / [X] Tested
- Week/Phase
- Agent: Cursor Agent X
- MCP Servers Used: Explicitly list required MCPs

### Core Sections
- **Description**: What this task accomplishes
- **Technical Approach**: How to build it
- **Implementation Steps**: Detailed todo list
- **Code/Files Created**: What was built
- **Testing Checklist**: How to verify
- **Dependencies**: What blocks this, what this blocks

### Senior Engineer Notes
- **What to Build**: Detailed explanation
- **Why This Approach**: Technical rationale
- **How to Build It**: Step-by-step guidance
- **Common Pitfalls**: Things to watch out for
- **Integration Points**: How to connect to backend
- **Canva Design Reference**: Link to design specs (if applicable)

### Progress Tracking
- **📊 Progress Log**: Dated entries as work progresses
- **✅ Todo List**: Checkable items for implementation
- **🏁 Completion Notes**: Final summary with status markers

---

## 🎨 Status Marker System

Each task tracks three status markers:

### Status Flow
```
Not Started → In Progress → Finished → Integrated → Tested
```

### Status Definitions
- **[ ] Not Started** - Task not begun
- **[ ] In Progress** - Currently working
- **[X] Finished** - Code complete, compiles successfully, ready for integration
- **[X] Integrated** - Connected to backend/APIs locally, data flows correctly in development environment
- **[X] Tested** - Unit tests, integration tests, manual testing complete, verified end-to-end (including Whop OAuth flow)

**Important Note:** "Integrated" means code connects to APIs locally in development. Full "Tested" status requires deployment to Vercel/GitHub and verification with actual Whop OAuth, Supabase database, and production environment.

---

## 🤝 Agent Responsibilities

### Cursor Agent 1: Workbook UI Specialist
**Responsibility**: Build all 30 interactive workbook exercise components

**Tasks**: 10 phase files (one per workbook phase)
- Each phase contains 3 exercises
- Total: 30 exercises across 10 phases

**MCP Requirements**:
- **Canva MCP**: MANDATORY - Use for all design references
- **Supabase MCP**: MANDATORY - Use for data fetching and progress tracking

**Dependencies**:
- Blocks on: Claude Agent 2 (API routes, Supabase queries)
- Uses: Canva Agent 4 designs as visual reference

### Cursor Agent 2: Journaling UI Specialist
**Responsibility**: Build 3 journaling interfaces

**Tasks**: 3 journal type files
- FreeForm journal
- Guided journal
- Scripting journal

**MCP Requirements**:
- **Supabase MCP**: MANDATORY - Use for all database operations
- **Canva MCP**: Optional - Use for journal UI design elements

**Dependencies**:
- Blocks on: Claude Agent 2 (journal API routes)
- Integrates with: AI Mentor for pattern analysis

### Cursor Agent 3: AI Mentor UI Specialist
**Responsibility**: Build AI chat interface with streaming

**Tasks**: 2 chat interface files
- Chat UI and message history
- Streaming responses

**MCP Requirements**:
- **Supabase MCP**: MANDATORY - Use for conversation history
- **Canva MCP**: Optional - Use for chat UI design elements

**Dependencies**:
- Blocks on: Claude Agent 2 (Claude API integration, chat API route)
- Uses: Supabase for conversation history

### Cursor Agent 4: Canva Design Specialist
**Responsibility**: Use Canva MCP to design all workbook graphics

**Tasks**: 11 design files
- Design system
- 10 phase design files (one per phase)
- Asset export

**MCP Requirements**:
- **Canva MCP**: MANDATORY - Use exclusively for all design work

**Dependencies**:
- Can start immediately (design phase)
- Provides designs to: Cursor Agent 1 for implementation reference

---

## 🔗 Related Files

- **[tasks/README.md](../tasks/README.md)** - Claude Code foundation tasks
- **[TODO.md](../TODO.md)** - High-level project status
- **[CLAUDE.md](../CLAUDE.md)** - Project overview and conventions
- **[docs/Core-App-Architecture.md](../docs/Core-App-Architecture.md)** - Technical specifications

---

## 🚀 Quick Reference

**Check overall project status:**
→ Read `TODO.md` and `tasks/README.md`

**Start new task:**
→ Copy `CURSOR-TASK-TEMPLATE.md`, fill it out

**Continue existing task:**
→ Read task MD file, check Progress Log, add new entry

**Complete task:**
→ Update status markers: Finished → Integrated → Tested

**Switch context:**
→ Read task file + Progress Log + check dependencies

**Last Updated:** 2025-10-31
**System Version:** 1.0
**Maintained By:** Cursor Development Team

---

## 📊 Current Progress Status

**Last Updated:** 2025-10-31

### Task Completion Summary

**Cursor Agent 1: Workbook UI Specialist**
- ✅ 001-phase-1-exercises.md - **Finished & Integrated** (All 3 exercises complete: Wheel of Life ✅, Core Values ✅, Emotion Tracker ✅ - data saves to Supabase via `/api/workbook/progress`)
- 🔄 Building Phases 2-10 in progress...

**Cursor Agent 2: Journaling UI Specialist**
- ✅ 001-freeform-journal.md - **Finished & Integrated** (Code complete, connected to `/api/journal` locally)
- ✅ 002-guided-journal.md - **Finished & Integrated** (Included in journal interface, connected to backend)
- ✅ 003-scripting-journal.md - **Finished & Integrated** (Included in journal interface, connected to backend)
- ⚠️ **Note:** Not yet tested with production Whop OAuth or deployed environment

**Cursor Agent 3: AI Mentor UI Specialist**
- ✅ 001-chat-interface.md - **Finished & Integrated** (Chat UI with message history, connected to `/api/chat` locally)
- ✅ 002-streaming-responses.md - **Finished & Integrated** (Real-time streaming implemented, Server-Sent Events working)
- ⚠️ **Note:** Not yet tested with production Whop OAuth or deployed environment

**Cursor Agent 4: Canva Design Specialist**
- ✅ **Canva MCP Connected** - Ready to begin design workflow
- ⏳ 001-workbook-design-system.md through 011-asset-export.md - **Not Started** (Canva MCP now available)

### Overall Progress

- **Foundation Complete:** ✅ All backend APIs ready (Claude Code tasks complete)
- **Dashboard:** ✅ Navigation and layout complete
- **AI Mentor:** ✅ Chat interface with streaming complete (local integration only)
- **Journaling:** ✅ All 3 journal types functional (local integration only)
- **Workbook:** ✅ Phase 1 complete (All 3 exercises integrated with Supabase via `/api/workbook/progress` API) | 🔄 Building Phases 2-10 continuously...
- **Canva Designs:** ✅ Canva MCP connected, ready to begin design workflow

**Total Tasks:** 26 files
- **Finished & Integrated (Local):** 6 (AI Mentor + Journaling + Workbook Phase 1)
- **In Progress:** 9 (Workbook Phases 2-10 being built continuously)
- **Pending:** 11 (Canva Designs)

**Current Build Status:** Building all 10 workbook phases continuously - Phase 1 complete, continuing through Phase 10...

### Deployment Status

⚠️ **Important:** All features marked as "Integrated" are connected locally in development only. They have NOT been:
- Deployed to Vercel/GitHub
- Tested with production Whop OAuth flow
- Verified with live Supabase database
- Tested end-to-end in production environment

**Next Steps for Production:**
1. Deploy to Vercel/GitHub
2. Test Whop OAuth flow in production
3. Verify Supabase database connections
4. Complete end-to-end testing
5. Mark tasks as "Tested" once verified

---

**Last Updated:** 2025-10-31
**System Version:** 1.0
**Maintained By:** Cursor Development Team

