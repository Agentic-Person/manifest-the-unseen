import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { createChatResponse } from '@/lib/claude'

// POST /api/journal - Create a new journal entry
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const whopUserId = cookieStore.get('whop_user_id')?.value

    if (!whopUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
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
    const { type, content, linked_phase } = body

    if (!type || !['freeForm', 'guided', 'scripting'].includes(type)) {
      return NextResponse.json({ error: 'Invalid journal type' }, { status: 400 })
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Generate AI analysis
    let aiAnalysis = null
    try {
      const analysisPrompt = `Analyze this journal entry and provide insights:
- Key themes and patterns
- Emotional tone
- Potential limiting beliefs
- Growth opportunities
- Suggestions for manifestation practices

Journal Entry:
${content}

Provide a brief, compassionate analysis.`

      const analysis = await createChatResponse(
        [{ role: 'user', content: analysisPrompt }],
        'You are a wise mentor providing gentle insights.'
      )

      aiAnalysis = {
        themes: [],
        tone: 'neutral',
        insights: analysis,
        generated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      // Continue without AI analysis if it fails
    }

    // Create journal entry
    const { data: journalEntry, error: insertError } = await supabaseAdmin
      .from('journal_entries')
      .insert({
        user_id: userProfile.id,
        type,
        content,
        ai_analysis: aiAnalysis,
        linked_phase: linked_phase || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating journal entry:', insertError)
      return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 })
    }

    return NextResponse.json({ data: journalEntry }, { status: 201 })
  } catch (error) {
    console.error('Journal API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create journal entry',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET /api/journal - Get user's journal entries
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const whopUserId = cookieStore.get('whop_user_id')?.value

    if (!whopUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('whop_user_id', whopUserId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabaseAdmin
      .from('journal_entries')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (type && ['freeForm', 'guided', 'scripting'].includes(type)) {
      query = query.eq('type', type)
    }

    const { data: entries, error } = await query

    if (error) {
      console.error('Error fetching journal entries:', error)
      return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 })
    }

    return NextResponse.json({ data: entries })
  } catch (error) {
    console.error('Journal API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch journal entries',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

