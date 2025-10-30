# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Manifest the Unseen** is an AI-powered manifestation coaching application built for the Whop platform. The app combines AI mentorship, structured workbook exercises, journaling with AI analysis, and guided meditations to help users master manifestation practices.

**Current Status**: Planning/Documentation phase - no source code exists yet.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS + Frosted UI (Whop's UI kit)
- **Backend**: Next.js API routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Whop OAuth (no custom auth needed)
- **AI/LLM**: Claude Haiku 4.5 API ($1/1M input, $5/1M output tokens)
- **Voice**: ElevenLabs Professional Voice Clone
- **Platform Integration**: @whop/api SDK
- **Package Manager**: pnpm

## Development Commands

```bash
# Installation
pnpm install

# Development
pnpm dev              # Start Next.js dev server (http://localhost:3000)

# Build & Deploy
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
```

## MCP Servers

Four MCP servers are configured for this project:

- **Whop MCP Server**
  - Direct integration with Whop platform APIs
  - Manage products, memberships, checkout sessions, webhooks
  - Query user data, subscriptions, and company information
  - Essential for all Whop platform operations

- **Pipedream MCP Server**
  - Workflow automation and API orchestration
  - Connect multiple services (ElevenLabs, Claude API, Whop, Supabase)
  - Build custom integrations and automated workflows
  - Useful for backend automation tasks

- **Supabase MCP Server**
  - Direct database operations and queries
  - Manage tables, authentication, storage, and real-time subscriptions
  - Execute SQL queries and manage database schema
  - Handle all database interactions for the app

- **Puppeteer MCP Server**
  - Browser automation and web scraping
  - Take screenshots, generate PDFs, test web interfaces
  - Useful for testing the Whop app UI and generating preview images
  - Automate workflows that require browser interaction

## Architecture

### Four Pillars Design

The app is organized around four integrated pillars:

1. **AI Monk Mentor**
   - Context-aware conversational AI guide
   - Custom GPT system prompt with calming monk personality
   - Voice responses via ElevenLabs (post-MVP)
   - Integrates user phase, goals, and recent journals into context

2. **Interactive Digital Workbook**
   - 10 sequential phases covering 200+ manifestation exercises
   - Progressive disclosure (phases unlock as user completes them)
   - Exercises stored in Supabase with completion tracking
   - Gamification: progress bars, badges, level progression

3. **Journaling Suite**
   - Multiple journal types (gratitude, vision, frequency, breakthrough)
   - AI pattern analysis and insights
   - Links to specific workbook phases
   - Streak tracking for daily practice

4. **Meditation & Audio Library**
   - Pre-generated meditation audio (Suno.ai + ElevenLabs)
   - Audio streaming player (MP3, 256kbps)
   - Usage tracking and completion stats
   - CDN delivery (Cloudflare or AWS S3)

### Multi-Tenant Architecture

- Single app serves multiple Whop communities
- User data isolated by `whop_user_id`
- Row-level security in Supabase
- Whop OAuth handles all authentication

## Database Schema (Supabase)

```sql
-- User Profile & Progress
user_profiles
  - user_id (uuid, FK to Whop user)
  - whop_user_id (string, unique)
  - current_phase (integer, 1-10)
  - signal_strength_score (integer, 0-100)
  - level (string: Seeker/Practitioner/Advanced/Master)
  - meditation_streak (integer)
  - journal_streak (integer)
  - badges (jsonb)
  - created_at, last_active

-- Workbook Exercise Completion
workbook_progress
  - id (uuid, PK)
  - user_id (uuid, FK)
  - phase (integer, 1-10)
  - exercise_key (string)
  - data (jsonb) -- user's exercise responses
  - completed (boolean)
  - completed_at (timestamp)

-- Journal Entries
journal_entries
  - id (uuid, PK)
  - user_id (uuid, FK)
  - type (string: gratitude/vision/frequency/breakthrough)
  - content (text)
  - ai_analysis (jsonb) -- AI-generated insights
  - linked_phase (integer, nullable)
  - created_at

-- AI Conversation History
ai_conversations
  - id (uuid, PK)
  - user_id (uuid, FK)
  - messages (jsonb array) -- [{role, content, timestamp}]
  - created_at, updated_at

-- Meditation Usage Tracking
meditation_history
  - id (uuid, PK)
  - user_id (uuid, FK)
  - meditation_id (uuid)
  - played_at (timestamp)
  - completed (boolean)
  - duration_seconds (integer)

-- Meditation Content Library
meditations
  - id (uuid, PK)
  - title, description
  - duration_seconds
  - category (string)
  - audio_url (string) -- CDN path
  - tags (string array)
```

## Streamlined MVP Approach

Build **basic versions of ALL four pillars** simultaneously:

- **AI Mentor**: Text-only chat with core monk personality (no voice yet)
- **Workbook**: All 10 phases with simplified exercises (focus on core activities)
- **Journaling**: Basic entry creation with simple AI analysis (pattern recognition only)
- **Meditation**: Audio player with 5-10 pre-generated meditations
- **Gamification**: Basic progress tracking, completion percentages, simple badge system
- **Polish**: Minimal - prioritize functionality and completeness

**Goal**: Users can experience the full manifestation journey end-to-end, even if features are basic.

## Key Conventions

### AI Monk Mentor Voice Personality

The AI mentor follows specific communication patterns:

- Short, contemplative sentences
- Thoughtful, probing questions rather than direct advice
- Non-judgmental, calming tone
- References to "signal beneath desire" and "frequency alignment"
- Metaphors from nature and quantum physics
- Example: "What signal lies beneath this desire? What frequency are you truly calling in?"

### Manifestation Methodology Principles

Core concepts woven throughout the app:

- **Signal vs. Desire**: Understanding true intention beyond surface wants
- **Identity Architecture**: Becoming who you need to be, not just doing actions
- **Frequency Over Force**: Alignment and resonance vs. pushing and striving
- **Embodiment**: Living as if the manifestation is already achieved
- **Quantum Field Activation**: Observer effect and consciousness shaping reality

### Design & Aesthetic Guidelines

The entire app should embody an **ancient Tibetan monk meditation** aesthetic:

**Visual Design:**
- **Color Palette**: Monotone, earthy tones - deep browns, warm grays, stone beiges, muted ochres, sage greens
- **Typography**: Clean, meditative fonts with ample whitespace - nothing rushed or cluttered
- **Layout**: Minimal, contemplative, spacious - inspired by monastery simplicity
- **Imagery**: Tibetan prayer flags, singing bowls, mountain monasteries, mandalas (if used sparingly)
- **Animations**: Slow, gentle transitions - nothing jarring or fast-paced

**Audio Design:**
- **Meditation Tracks**: Tibetan singing bowls, throat singing, chimes, bells
- **Ambient Sounds**: Mountain winds, temple bells, gentle water, fire crackling
- **Frequency Healing**: 432Hz, 528Hz, binaural beats for deep states
- **Sound Vibrations**: Deep resonant tones, harmonic overtones

**Tone & Voice:**
- **Writing Style**: Calm, grounded, wise - like an ancient teacher
- **UI Copy**: Short, contemplative phrases - no marketing hype
- **Notifications**: Gentle reminders, not aggressive prompts
- **Error Messages**: Patient and understanding, never harsh

**Overall Feel:**
- Timeless, sacred, grounded
- Connection to ancient wisdom and nature
- Quiet power and deep peace
- No modern tech aesthetic - embrace the old-world monastery vibe

### Cost Optimization Strategies

- Pre-generate meditation audio (one-time cost, no per-user generation)
- Use efficient Claude Haiku model for AI mentor (cheapest tier)
- Cache common AI responses (greeting, phase introductions)
- Stream AI responses for perceived speed
- CDN for audio files to reduce bandwidth costs
- Lazy load workbook phases (don't load all at once)

### Performance Considerations

- Lazy load workbook phases (only load current + next)
- Stream AI responses for real-time feel
- Optimize images as WebP
- Audio streaming (not full download)
- Implement request debouncing for AI calls

## Project Structure (When Implemented)

```
manifest_the_unseen/
├── app/
│   ├── customer/[experienceId]/     # User-facing app
│   │   ├── home/                    # Dashboard
│   │   ├── workbook/                # 10 phases interface
│   │   ├── journal/                 # Journaling suite
│   │   ├── meditations/             # Audio library
│   │   ├── mentor/                  # AI chat interface
│   │   └── profile/                 # User settings
│   ├── seller/[companyId]/          # Community owner admin
│   ├── before-checkout/             # Feature preview
│   └── api/
│       ├── chat/                    # AI mentor endpoints
│       ├── journal/                 # CRUD operations
│       ├── progress/                # Track workbook completion
│       ├── audio/                   # Stream meditations
│       └── webhook/                 # Whop webhook handlers
├── components/
│   ├── ui/                          # Frosted UI components
│   ├── workbook/                    # Phase-specific components
│   ├── journal/                     # Journal entry components
│   └── meditation/                  # Audio player components
├── lib/
│   ├── supabase.ts                  # Database client
│   ├── claude.ts                    # AI integration
│   ├── elevenlabs.ts                # Voice API (post-MVP)
│   └── whop.ts                      # Whop SDK utilities
├── public/
│   └── audio/                       # Pre-generated meditations
└── docs/                            # Architectural documentation
```

## Environment Variables

```bash
# Whop Platform
WHOP_API_KEY=
WHOP_CLIENT_ID=
WHOP_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Services
ANTHROPIC_API_KEY=                   # Claude Haiku 4.5
ELEVENLABS_API_KEY=                  # Voice synthesis (post-MVP)

# Audio CDN
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_BUCKET=
```

## Next Steps to Begin Development

1. Initialize Next.js project: `pnpm create next-app@latest . --typescript --tailwind --app`
2. Install Whop SDK: `pnpm add @whop/api`
3. Set up Supabase project and configure database schema
4. Install dependencies: `pnpm add @supabase/supabase-js @anthropic-ai/sdk`
5. Create environment variables file
6. Set up Whop OAuth integration
7. Begin MVP development (all four pillars in parallel)

## Reference Documentation

- **Core-App-Architecture.md**: Complete technical specifications
- **manifest_the_unseen_PP.md**: Product planning and strategy
- **manifest_the_unseen_cn.md**: Philosophical foundation and teaching methodology
- **ManifestTheUnseen.pdf**: Full book content
- **ManifestTheUnseen-Workbook.pdf**: 200+ page exercise workbook
