import { NextRequest, NextResponse } from 'next/server'
import { createChatStream, buildMonkMentorPrompt } from '@/lib/claude'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from cookies
    const cookieStore = await cookies()
    const whopUserId = cookieStore.get('whop_user_id')?.value

    if (!whopUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for context
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('whop_user_id', whopUserId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get request body
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get conversation history from Supabase
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userProfile.id)
      .single()

    // Build message history
    let messages: Array<{ role: 'user' | 'assistant'; content: string }> = []

    if (conversation && conversation.messages) {
      messages = conversation.messages as Array<{ role: 'user' | 'assistant'; content: string }>
    }

    // Add new user message
    messages.push({ role: 'user', content: message })

    // Build context-aware system prompt
    const systemPrompt = buildMonkMentorPrompt({
      currentPhase: userProfile.current_phase,
      // TODO: Add user goals and recent journals when available
    })

    // Create streaming response
    const stream = await createChatStream(messages, systemPrompt)

    // Create ReadableStream for response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ''

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text
              fullResponse += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }

          // Save conversation to Supabase
          messages.push({ role: 'assistant', content: fullResponse })

          if (conversation) {
            // Update existing conversation
            await supabaseAdmin
              .from('ai_conversations')
              .update({
                messages,
                updated_at: new Date().toISOString(),
              })
              .eq('id', conversation.id)
          } else {
            // Create new conversation
            await supabaseAdmin.from('ai_conversations').insert({
              user_id: userProfile.id,
              messages,
            })
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

