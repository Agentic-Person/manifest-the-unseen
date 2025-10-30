# Manifest the Unseen

> An AI-powered manifestation coaching experience for Whop communities. Text-first MVP with an ancient monastery aesthetic and calm, wise guidance.

<!-- Hero Image: WebP-first with PNG fallback; served from public/ for Next.js -->
<p align="center">
  <picture>
    <source srcset="/images/Tibetan-monk.webp" type="image/webp" />
    <img src="/images/Tibetan-monk.png" alt="AI Monk Mentor" width="720" />
  </picture>
  <br />
  <em>Manifest the Unseen</em>
  
</p>

## Repository

- GitHub: [`Agentic-Person/manifest-the-unseen`](https://github.com/Agentic-Person/manifest-the-unseen)

## Status

Planning/Documentation phase. Core specifications live in `docs/` and `CLAUDE.md`. MVP will ship all four pillars in basic, usable form.

## Four Pillars

- AI Monk Mentor — Context-aware chat with Claude Haiku 4.5 (text-only MVP)
- Interactive Workbook — 10 phases, progressive unlocks, completion tracking
- Journaling Suite — Gratitude/Vision/Frequency/Breakthrough with AI insights
- Meditation Library — Pre-generated audio, simple player, usage tracking

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind + Frosted UI (Whop)
- Backend: Next.js API routes
- DB: Supabase (PostgreSQL)
- Auth: Whop OAuth
- AI: Claude Haiku 4.5 (`@anthropic-ai/sdk`)
- Voice (post-MVP): ElevenLabs
- Platform: `@whop/api` SDK
- Package manager: pnpm

## Local Development

```bash
pnpm install
pnpm dev           # http://localhost:3000

# Quality
pnpm lint
pnpm format

# Production
pnpm build
pnpm start
```

## Environment Variables

Create an `.env.local` (and `.env` for server-only) using `.env.example` as a reference.

```bash
# Whop
WHOP_API_KEY=
WHOP_CLIENT_ID=
WHOP_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=

# Audio CDN (optional)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_BUCKET=
```

## MCP Servers

This project is configured to use multiple MCP servers for dev ergonomics and automation. See `MCP_SETUP_GUIDE.md` and `.cursor/mcp-readme.md`.

- Whop MCP — product/membership management and webhooks
- Pipedream MCP — workflow automation across services
- Supabase MCP — DB schema/queries, logs, advisors
- Puppeteer MCP — UI testing, screenshots, PDF generation

## Project Structure (planned)

```
manifest_the_unseen/
├─ app/
│  ├─ customer/[experienceId]/
│  ├─ seller/[companyId]/
│  └─ api/
├─ components/
├─ lib/
├─ public/
│  └─ audio/
├─ docs/
└─ tasks/
```

## Design & Aesthetic

- Earthy, monastery-inspired palette and typography
- Calm copy; gentle motion; contemplative spacing
- Audio: bowls, chimes, throat singing; 432/528Hz options

## Cost & Performance

- Claude Haiku 4.5 for low-cost LLM
- Pre-generated meditations; CDN delivery
- Cache common AI responses; stream responses
- Lazy-load workbook phases and media

## Contributing

1. Create a feature branch from `main`
2. Follow Conventional Commits (e.g., `feat:`, `chore:`, `fix:`)
3. Keep PRs focused and reasonably scoped

## Image Guidance

- The README references `/images/Tibetan-monk.png` which should live at `public/images/Tibetan-monk.png`.

## References

- Core Architecture: `docs/Core-App-Architecture.md`
- Planning & Product: `docs/manifest_the_unseen_PP.md`
- Methodology: `docs/manifest_the_unseen_cn.md`
- Claude Code guidance: `CLAUDE.md`

---

“What signal lies beneath this desire? What frequency are you calling in?”
