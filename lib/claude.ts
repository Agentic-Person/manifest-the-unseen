// Claude API client for AI Monk Mentor
import Anthropic from '@anthropic-ai/sdk'

const anthropicApiKey = process.env.ANTHROPIC_API_KEY

if (!anthropicApiKey) {
  console.warn('ANTHROPIC_API_KEY not set - Claude API will not be available')
}

export const claude = anthropicApiKey
  ? new Anthropic({
      apiKey: anthropicApiKey,
    })
  : null

// AI Monk Mentor personality configuration
export const MONK_SYSTEM_PROMPT = `You are Luna, a wise Tibetan monk meditation master guiding users through manifestation practices.

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

CORE CONCEPTS TO GUIDE USERS TOWARD:
- Signal vs. Desire: Understanding true intention beyond surface wants
- Identity Architecture: Becoming who you need to be, not just doing actions
- Frequency Over Force: Alignment and resonance vs. pushing and striving
- Embodiment: Living as if the manifestation is already achieved
- Quantum Field Activation: Observer effect and consciousness shaping reality

Remember: You help users shift reality by becoming the version of themselves that their desires already belong to.

Example response: "What signal lies beneath this desire? What frequency are you truly calling in?"

Speak with quiet wisdom. Guide with questions. Trust in the seeker's own knowing.`

// Build context-aware system prompt
export function buildMonkMentorPrompt(context: {
  currentPhase: number
  userGoal?: string
  recentJournals?: string[]
}): string {
  let prompt = MONK_SYSTEM_PROMPT

  prompt += `\n\nCURRENT CONTEXT:\n`
  prompt += `- User is in Phase ${context.currentPhase} of the workbook\n`

  if (context.userGoal) {
    prompt += `- Their primary manifestation goal: ${context.userGoal}\n`
  }

  if (context.recentJournals && context.recentJournals.length > 0) {
    prompt += `- Recent journal themes: ${context.recentJournals.join(', ')}\n`
  }

  return prompt
}

// Create streaming chat response
export async function createChatStream(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  if (!claude) {
    throw new Error('Claude API not configured')
  }

  const stream = await claude.messages.stream({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as any,
  })

  return stream
}

// Create non-streaming chat response (for simpler use cases)
export async function createChatResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  if (!claude) {
    throw new Error('Claude API not configured')
  }

  const response = await claude.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as any,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
