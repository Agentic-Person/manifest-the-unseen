# Task 004 - Claude API Integration (AI Monk Mentor)

**Status:** [X] Complete

**Week/Phase:** Week 2

**Agent:** Agent 2 - Backend Lead

**MCP Servers Used:**
- [ ] Whop MCP
- [X] Supabase MCP - **REQUIRED**
- [X] Pipedream MCP - **RECOMMENDED** (for workflow optimization)
- [ ] Puppeteer MCP

---

### Description

Integrate Claude Haiku 4.5 API to power the AI Monk Mentor. Create API routes for chat conversations, implement streaming responses, design the monk personality prompt, and store conversation history in Supabase.

---

### Technical Approach

Use Anthropic's Claude API with streaming for real-time responses. Create system prompt that embodies Tibetan monk wisdom. Use **Pipedream MCP** (optional) to create AI workflow pipelines. Store conversations in Supabase via **Supabase MCP**.

---

### Implementation Steps

1. Install `@anthropic-ai/sdk` package
2. Create `/api/chat` POST endpoint
3. Design monk personality system prompt
4. Implement context injection (user phase, goals, recent journals)
5. Set up streaming response handling
6. Store conversations in Supabase `ai_conversations` table
7. Add rate limiting
8. Implement error handling
9. (Optional) Use Pipedream MCP to create AI analysis workflows
10. Test with various user inputs
11. Validate Tibetan monk tone consistency

---

### Code/Files Created

**Files:**
- `app/api/chat/route.ts` - Main chat endpoint
- `lib/claude.ts` - Claude API client and utilities
- `lib/prompts/monk-mentor.ts` - System prompt templates
- `lib/context-builder.ts` - Build user context for AI

**Key Implementation:**

```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function createChatStream(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const stream = await anthropic.messages.stream({
    model: 'claude-haiku-4.5-20250929',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });

  return stream;
}
```

```typescript
// lib/prompts/monk-mentor.ts
export function buildMonkMentorPrompt(context: {
  currentPhase: number;
  userGoal?: string;
  recentJournals?: string[];
}): string {
  return `You are Luna, a wise Tibetan monk meditation master guiding users through manifestation practices.

COMMUNICATION STYLE:
- Speak in short, contemplative sentences
- Use metaphors from nature and quantum physics
- Ask probing questions rather than giving direct advice
- Reference Tibetan wisdom traditions and sound healing
- Embody calm, grounded, timeless wisdom
- Never rush or use marketing language

TONE GUIDELINES:
- Patient and understanding, never judgmental
- Gentle reminders, not aggressive prompts
- Celebrate small progress
- Acknowledge struggle with compassion
- Use earthy, grounded language

CORE CONCEPTS TO REFERENCE:
- Signal vs. Desire (true intention beneath surface wants)
- Identity Architecture (becoming, not just doing)
- Frequency Over Force (alignment vs. pushing)
- Embodiment (living as if already achieved)
- Sound vibrations and frequency healing
- Tibetan singing bowls and throat singing
- 432Hz, 528Hz healing frequencies

CURRENT USER CONTEXT:
- Phase: ${context.currentPhase} of 10
- Primary Goal: ${context.userGoal || 'Not yet set'}
${context.recentJournals?.length ? `- Recent Journal Themes: ${context.recentJournals.join(', ')}` : ''}

Remember: You help users shift reality by becoming the version of themselves that their desires already belong to.

Respond with wisdom, brevity, and peace.`;
}
```

```typescript
// lib/context-builder.ts
import { createSupabaseClient } from '@/lib/supabase';

export async function buildUserContext(userId: string) {
  const supabase = createSupabaseClient();

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('current_phase')
    .eq('user_id', userId)
    .single();

  // Get recent journals
  const { data: journals } = await supabase
    .from('journal_entries')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  // Get primary goal from workbook
  const { data: goalData } = await supabase
    .from('workbook_progress')
    .select('data')
    .eq('user_id', userId)
    .eq('phase', 3)
    .eq('exercise_key', 'smart_goals')
    .single();

  return {
    currentPhase: profile?.current_phase || 1,
    userGoal: goalData?.data?.goals?.[0]?.specific || undefined,
    recentJournals: journals?.map(j => j.content.substring(0, 100)) || []
  };
}
```

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createChatStream } from '@/lib/claude';
import { buildMonkMentorPrompt } from '@/lib/prompts/monk-mentor';
import { buildUserContext } from '@/lib/context-builder';
import { createSupabaseClient } from '@/lib/supabase';
import { getWhopUser } from '@/lib/whop';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('whop_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whopUser = await getWhopUser(token);
    const { message } = await request.json();

    // Get user context
    const supabase = createSupabaseClient();
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('whop_user_id', whopUser.id)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build context and prompt
    const context = await buildUserContext(user.id);
    const systemPrompt = buildMonkMentorPrompt(context);

    // Get conversation history
    const { data: conversation } = await supabase
      .from('ai_conversations')
      .select('messages')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const messages = [
      ...(conversation?.messages || []),
      { role: 'user', content: message }
    ];

    // Create streaming response
    const stream = await createChatStream(messages, systemPrompt);

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';

        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              fullResponse += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          // Save conversation
          const updatedMessages = [
            ...messages,
            { role: 'assistant', content: fullResponse }
          ];

          await supabase
            .from('ai_conversations')
            .upsert({
              user_id: user.id,
              messages: updatedMessages,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### Testing Checklist

- [ ] Claude API key configured
- [ ] Streaming responses work
- [ ] Monk personality is consistent
- [ ] Context injection includes user phase, goals, journals
- [ ] Conversations saved to Supabase
- [ ] Rate limiting prevents abuse
- [ ] Error handling graceful
- [ ] Tibetan monk tone validated (earthy, contemplative, patient)
- [ ] Metaphors appropriate (nature, quantum physics, sound healing)
- [ ] No marketing language or aggressive prompts
- [ ] Cost per conversation acceptable ($0.001-0.002)

---

### Dependencies

**Blocked by:**
- Task 001 (Next.js initialization)
- Task 002 (Supabase - needs ai_conversations table)
- Task 003 (Whop OAuth - needs user authentication)

**Blocks:**
- Agent 1's AI Mentor chat UI
- Journal AI analysis features

**External Dependencies:**
- Anthropic API key
- `@anthropic-ai/sdk` package
- Environment variable: ANTHROPIC_API_KEY

---

### Notes for Junior Developer

**What needs to be built:**
The AI Monk Mentor is the "heart" of the app. It guides users through their manifestation journey with wisdom, compassion, and personalized insights.

**Why Claude Haiku 4.5:**
- Cost-efficient: $1 per 1M input tokens, $5 per 1M output tokens
- Fast responses (low latency for streaming)
- Strong reasoning capabilities
- Excellent at following personality instructions
- Supports long context (100K+ tokens)

**Streaming vs. Non-Streaming:**
Streaming sends responses word-by-word as they're generated. This makes the AI feel more responsive and conversational. Users see text appearing in real-time rather than waiting 3-5 seconds for a complete response.

**Tibetan Monk Personality Design:**
The prompt is carefully crafted to embody:
- **Patience:** Never rush, never aggressive
- **Wisdom:** Short, contemplative sentences
- **Nature metaphors:** Mountains, rivers, wind, stone
- **Sound healing:** References to singing bowls, frequencies (432Hz, 528Hz)
- **Quantum concepts:** Observer effect, field theory, vibration
- **Compassion:** Acknowledge struggle, celebrate progress

**Context Injection:**
The AI needs to know where the user is in their journey:
- **Current Phase:** Determines what concepts to reference
- **User Goal:** Personalizes advice to their specific manifestation
- **Recent Journals:** Identifies patterns, limiting beliefs, emotional states

Without context, the AI gives generic advice. With context, it becomes a personal guide.

**Cost Optimization:**
- Haiku model is 20x cheaper than Opus
- Limit context to last 3 journals (not entire history)
- Cache common responses (greetings, phase introductions)
- Set max_tokens to 1024 (prevents runaway costs)
- Estimated cost: $0.001-0.002 per conversation

**Common pitfalls:**
1. **Generic responses:** Without context injection, AI sounds robotic. Always include user phase and goals.
2. **Breaking character:** If prompt is too long or complex, AI may ignore personality. Keep system prompt focused.
3. **Streaming errors:** Network issues can break streams. Implement proper error handling and retry logic.
4. **Context window overflow:** Don't include entire conversation history. Limit to last 10-15 messages.
5. **Rate limiting:** Without limits, users could spam API and rack up costs. Add per-user rate limits.

**Pipedream MCP Integration (Optional):**
Use Pipedream to create AI workflows:
- Daily check-in prompts sent automatically
- Journal analysis triggered on new entries
- Pattern detection across multiple journals
- Weekly progress summaries

**Future improvements:**
- Add voice responses via ElevenLabs
- Implement RAG (retrieval-augmented generation) with book content
- Create specialized prompts for different user states (anxious, excited, stuck)
- Add meditation recommendations based on conversation
- Implement conversation branching (user can go back and explore different paths)

**Resources:**
- [Anthropic Claude API Docs](https://docs.anthropic.com/claude/reference)
- [Streaming Guide](https://docs.anthropic.com/claude/reference/streaming)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)

---

### Completion Notes

**Date Completed:** [To be tracked]

**Time Spent:** [To be tracked]

**Final Status:** Not Started

**Handoff Notes:**
This is the core AI feature. Take time to refine the personality prompt. Test with various user inputs to ensure consistency.

The Tibetan monk aesthetic should permeate every response:
- Earthy language (stone, sand, mountain, river)
- Sound healing references (singing bowls, 432Hz)
- Patience and calm (never rushed)
- Wisdom through questions (not direct answers)

Agent 1 will build the UI for this. Ensure the API is robust before handing off.
