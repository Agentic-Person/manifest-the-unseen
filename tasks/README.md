# Task Management System

## Overview

This task management system tracks all development work across 4 specialized agents. Each agent has their own subfolder with detailed task files.

## Directory Structure

```
tasks/
├── README.md (this file)
├── TASK-TEMPLATE.md (template for new tasks)
├── agent-1-frontend-lead/
├── agent-2-backend-lead/
├── agent-3-journal-meditation-specialist/
└── agent-4-integration-lead/
```

## How to Use

### Creating a New Task

1. Copy `TASK-TEMPLATE.md`
2. Name it with format: `###-task-name.md` (e.g., `001-setup-dashboard.md`)
3. Fill in all sections
4. Update status as work progresses

### Task Status Meanings

- **Not Started:** Task is documented but no work has begun
- **In Progress:** Actively being worked on
- **Testing:** Implementation complete, undergoing testing
- **Complete:** Fully implemented, tested, and functioning

### Agent Responsibilities

**Agent 1 - Frontend Lead:**
- AI Mentor chat UI
- All 10 workbook phase interfaces
- Dashboard and navigation
- Progress tracking visualizations
- Primary MCP Server: Puppeteer (for UI testing)

**Agent 2 - Backend Lead:**
- All API routes
- Database schema and operations
- Whop OAuth integration
- Claude API integration
- Primary MCP Servers: Whop, Supabase, Pipedream

**Agent 3 - Journal/Meditation Specialist:**
- 4 journal types
- Audio player component
- Meditation content generation
- Tracking systems
- Primary MCP Servers: Supabase, Pipedream

**Agent 4 - Integration Lead:**
- Gamification system
- Cross-pillar integrations
- End-to-end testing
- Deployment
- Primary MCP Server: Puppeteer (for E2E testing)

## Critical Requirements

### MCP Server Usage

**IMPORTANT:** Do NOT build any features without using the appropriate MCP servers. If an MCP server is not available, STOP and document what's needed.

- Tasks requiring Whop MCP: Must wait for Whop connection
- Tasks requiring Supabase MCP: Must wait for Supabase connection
- Tasks requiring Pipedream MCP: Must wait for Pipedream connection
- Tasks requiring Puppeteer MCP: Must wait for Puppeteer connection

### Documentation Standards

Each task must include:
1. Clear description for junior developers
2. Technical rationale for decisions
3. Common pitfalls to avoid
4. Testing checklist
5. Completion notes

## Week-by-Week Overview

### Week 1-2: Foundation
- Agent 2: Whop OAuth, Supabase schema, basic API structure (CRITICAL PATH)
- Agent 3: Begin meditation script writing
- Agent 4: Design gamification system, create testing plan
- Agent 1: Wait for backend foundation

### Week 3-4: Core Features
- Agent 1: AI Mentor chat UI, Dashboard skeleton, Phase 1-3 workbook
- Agent 2: Claude API integration, Journal CRUD APIs, Workbook data models
- Agent 3: Journal entry components, start audio generation
- Agent 4: Phase 1 workbook design review, QA setup

### Week 5-6: Expansion
- Agent 1: Phase 4-6 workbook forms (manifestation techniques)
- Agent 2: Progress tracking APIs, optimization
- Agent 3: Complete meditations, polish audio player
- Agent 4: Integration testing begins

### Week 7-8: Integration
- Agent 1 & 2: Connect frontend to APIs
- Agent 3: Meditation tracking, streak counters
- Agent 4: Gamification implementation, seller view

### Week 9: Polish & Launch
- All agents: Bug fixes, testing
- Agent 4: Final E2E testing, deployment

## Next Steps

1. Review all task files in each agent's folder
2. Ensure MCP servers are connected and running
3. Begin with Agent 2's foundational tasks (critical path)
4. Agents 1, 3, 4 can work in parallel once foundation is ready
5. Update task files as work progresses
6. Document everything for knowledge transfer

## Questions or Issues?

If you encounter blockers:
1. Document the issue in the task file
2. Mark status appropriately
3. Identify dependencies that need resolution
4. Update "Handoff Notes" for next developer
