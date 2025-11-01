# Agent Builds - Master Orchestration

**Project:** Manifest the Unseen
**Last Updated:** 2025-10-31
**Current Phase:** Phase 1 Complete, Phase 2 In Progress

---

## 📋 Overview

This document serves as the **master orchestration file** for all agent-based development work on Manifest the Unseen. It tracks what each agent is building, current status, and provides a map to detailed task documentation.

---

## 🗂️ Documentation Structure

```
manifest_the_unseen/
├── agent_builds.md                    # THIS FILE - Master orchestration
├── tasks/                             # Agent task documentation
│   ├── agent-1-frontend-lead/
│   │   ├── 001-dashboard-layout-navigation.md
│   │   └── [future tasks...]
│   ├── agent-2-backend-lead/
│   │   ├── 001-initialize-nextjs-project.md
│   │   ├── 002-supabase-database-setup.md
│   │   ├── 003-whop-oauth-integration.md
│   │   ├── 004-claude-api-integration.md
│   │   └── [future tasks...]
│   ├── agent-3-journal-meditation-specialist/
│   │   ├── 001-meditation-content-creation.md
│   │   └── [future tasks...]
│   ├── agent-4-integration-lead/
│   │   ├── 001-testing-framework-setup.md
│   │   └── [future tasks...]
│   └── TASK-TEMPLATE.md               # Template for new tasks
└── TODO.md                            # High-level project status
```

---

## 🤖 Agent Roles & Responsibilities

### Agent 1: Frontend Lead
**Focus:** UI/UX for all four pillars
**Tech:** Next.js App Router, React, Tailwind CSS (burgundy/gold/brown theme)
**MCP Required:** Puppeteer (for UI testing)

**Current Tasks:**
- [Pending] 001 - Dashboard Layout & Navigation

---

### Agent 2: Backend Lead
**Focus:** Foundation, APIs, Database, Authentication
**Tech:** Next.js API routes, Supabase, Whop SDK, Claude API
**MCP Required:** Whop, Supabase, Pipedream (optional)

**Current Tasks:**
- [✅ Complete] 001 - Initialize Next.js Project
- [⏳ In Progress] 002 - Supabase Database Setup
- [⏳ In Progress] 003 - Whop OAuth Integration
- [Pending] 004 - Claude API Integration

---

### Agent 3: Journal/Meditation Specialist
**Focus:** Content creation, journaling features, meditation library
**Tech:** Audio production, content strategy, Supabase
**MCP Required:** Pipedream (optional for workflows)

**Current Tasks:**
- [Excluded from MVP] 001 - Meditation Content Creation

**Note:** Meditation features removed from MVP scope. Content remains for post-MVP implementation.

---

### Agent 4: Integration & Polish Lead
**Focus:** Testing, QA, deployment, gamification
**Tech:** Jest, React Testing Library, Puppeteer
**MCP Required:** Puppeteer

**Current Tasks:**
- [⏳ In Progress] 001 - Testing Framework Setup

---

## 📊 Current Build Status

### Phase 1: Foundation ✅ COMPLETE
| Agent | Task | Status | Time Spent | Notes |
|-------|------|--------|------------|-------|
| Agent 2 | 001 - Initialize Next.js | ✅ Complete | ~20 min | All dependencies installed, burgundy/gold theme configured |

**Deliverables:**
- ✅ Next.js 14 App Router structure created
- ✅ TypeScript & Tailwind configured
- ✅ Burgundy/gold/brown Tibetan aesthetic theme
- ✅ Dependencies installed (@supabase, @anthropic-ai, @whop-sdk)
- ✅ Dev server running on localhost:3000
- ✅ Placeholder routes for customer area

---

### Phase 2: Parallel Backend Foundation ⏳ IN PROGRESS

**Started:** 2025-10-31
**Expected Completion:** Week 1, Days 3-7

| Agent | Task | Status | Progress | Estimated Time |
|-------|------|--------|----------|----------------|
| Agent 2a | 002 - Supabase Database Setup | ⏳ In Progress | 0% | 4-6 hours |
| Agent 2b | 003 - Whop OAuth Integration | ⏳ In Progress | 0% | 6-8 hours |
| Agent 4 | 001 - Testing Framework Setup | ⏳ In Progress | 0% | 4-6 hours |

**Notes:**
- All three tasks running in parallel
- No dependencies between tasks
- MCP servers verified and connected

---

### Phase 3: Parallel AI + UI 📅 UPCOMING

**Planned Start:** Week 2, Days 1-4

| Agent | Task | Status | Estimated Time |
|-------|------|--------|----------------|
| Agent 2 | 004 - Claude API Integration | Pending | 6-8 hours |
| Agent 1 | 001 - Dashboard Layout & Navigation | Pending | 6-8 hours |

**Dependencies:**
- Agent 1 Task 001 requires Phase 2 completion (auth & database)
- Agent 2 Task 004 requires Phase 2 Supabase setup

---

## 📝 Task Documentation Format

Each task file in `tasks/[agent-name]/` follows this structure:

```markdown
# [Task Number] - [Task Name]

**Agent:** [Agent Name]
**Status:** [Not Started | In Progress | Complete | Blocked]
**Estimated Time:** [X hours]
**Actual Time:** [X hours] (filled on completion)
**MCP Servers Required:** [List]

---

## 🎯 Objective

[Clear description of what this task accomplishes]

---

## 📋 Requirements

[Detailed requirements from senior engineer perspective]

---

## 🛠️ Implementation Plan

[Step-by-step build instructions]

---

## ✅ Acceptance Criteria

[How to verify task is complete]

---

## 📊 Progress Log

**[Date] - [Status Update]**
- [What was done]
- [Blockers encountered]
- [Next steps]

---

## 🏁 Completion Notes

[Filled when task is complete]
- What was delivered
- Any deviations from plan
- Known issues
- Handoff notes for dependent tasks
```

---

## 🔄 Workflow for Agent Builds

### When Starting a New Task:

1. **Create Task MD File**
   - Use `tasks/TASK-TEMPLATE.md` as starting point
   - Fill in agent, objective, requirements, plan
   - Save to appropriate agent folder

2. **Update This File (agent_builds.md)**
   - Add task to agent's "Current Tasks" section
   - Update Phase tables with new task

3. **Begin Development**
   - Follow implementation plan in task MD file
   - Update progress log regularly
   - Document blockers immediately

### During Development:

1. **Update Task MD File**
   - Add progress log entries with date stamps
   - Document decisions and deviations
   - Note blockers and dependencies

2. **Update agent_builds.md**
   - Change status indicators (⏳, ✅, ❌, 🚫)
   - Update progress percentages
   - Note time spent

### When Completing a Task:

1. **Finalize Task MD File**
   - Fill "Completion Notes" section
   - Document deliverables
   - Add handoff notes for dependent tasks
   - Mark status as "Complete"

2. **Update agent_builds.md**
   - Mark task as ✅ Complete
   - Fill actual time spent
   - Update phase completion status

3. **Create Handoff Documentation**
   - If task has dependent tasks, document integration points
   - Update relevant placeholder files with completion status

---

## 🎯 Current Sprint Goals

### Week 1 (Days 3-7) - Phase 2
- [ ] Complete Supabase database schema (5 core tables)
- [ ] Complete Whop OAuth integration
- [ ] Complete testing framework setup
- [ ] All Phase 2 tasks ready for Phase 3

### Week 2 (Days 1-4) - Phase 3
- [ ] Claude API integration complete
- [ ] Dashboard with burgundy/gold UI complete
- [ ] Users can log in and see personalized dashboard
- [ ] AI Mentor chat functional

---

## 🚨 Active Blockers

**None currently** - All MCP servers connected and verified.

---

## 📈 Project Metrics

**Total Tasks Planned:** 6 (MVP scope)
**Tasks Completed:** 1
**Tasks In Progress:** 3
**Tasks Pending:** 2
**Overall Progress:** ~17%

**Estimated Total Time:** 40-52 hours
**Time Spent:** ~0.33 hours
**Projected Completion:** End of Week 2

---

## 🔗 Quick Links

- [TODO.md](./TODO.md) - High-level project status
- [CLAUDE.md](./CLAUDE.md) - Project overview and conventions
- [Task Template](./tasks/TASK-TEMPLATE.md) - Template for new tasks
- [Core Architecture](./docs/Core-App-Architecture.md) - Technical specifications

---

## 📞 Agent Communication Protocol

When **switching agents or tools**:

1. **Read this file first** - Get current project state
2. **Read relevant task MD file** - Get detailed context
3. **Check Progress Log** - See what was last done
4. **Continue from last entry** - Pick up where previous agent left off
5. **Update Progress Log** - Document what you're doing

When **handing off to another agent**:

1. **Update Progress Log** - Document current state
2. **Note blockers** - What's preventing progress
3. **Update agent_builds.md** - Change task status
4. **Create integration notes** - Help next agent integrate your work

---

## 🎨 Design System Reference

**Color Palette (Tibetan Monk Aesthetic):**
- **Burgundy:** `monk-burgundy-600` (#b73551) - Primary, headings, CTAs
- **Gold:** `monk-gold-500` (#d4a017) - Accents, links, highlights
- **Brown:** `monk-brown-700` (#977669) - Text, borders, backgrounds

**Typography:**
- **Sans:** Inter (body text, UI)
- **Serif:** Lora (headings, emphasis)

**Navigation:**
- Horizontal top bar only (NO sidebar - Whop has its own)
- Streamlined minimal buttons
- Routes: Home | AI Mentor | Workbook | Journal | Profile

---

## ✨ Success Criteria

**MVP Complete When:**
- ✅ Users can authenticate via Whop OAuth
- ✅ Users see personalized dashboard with progress
- ✅ AI Mentor chat works with monk personality
- ✅ Users can access and complete workbook exercises
- ✅ Users can create journal entries with AI analysis
- ✅ Basic gamification shows progress and streaks
- ✅ All features tested (unit + E2E)

**Non-MVP (Post-Launch):**
- ❌ Meditation audio library
- ❌ ElevenLabs voice responses
- ❌ Advanced gamification (badges, levels)
- ❌ Community features

---

**Last Updated:** 2025-10-31 by Phase 1 Completion
**Next Update:** After Phase 2 agent tasks complete
