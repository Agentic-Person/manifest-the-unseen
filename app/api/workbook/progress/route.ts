import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

// POST /api/workbook/progress - Save workbook exercise progress
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
    const { phase, exercise_key, data, completed } = body

    if (!phase || phase < 1 || phase > 10) {
      return NextResponse.json({ error: 'Invalid phase (must be 1-10)' }, { status: 400 })
    }

    if (!exercise_key || typeof exercise_key !== 'string') {
      return NextResponse.json({ error: 'Exercise key is required' }, { status: 400 })
    }

    // Upsert workbook progress
    const { data: progress, error: upsertError } = await supabaseAdmin
      .from('workbook_progress')
      .upsert(
        {
          user_id: userProfile.id,
          phase,
          exercise_key,
          data: data || {},
          completed: completed || false,
          completed_at: completed ? new Date().toISOString() : null,
        },
        {
          onConflict: 'user_id,phase,exercise_key',
        }
      )
      .select()
      .single()

    if (upsertError) {
      console.error('Error saving workbook progress:', upsertError)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    // If exercise was completed, check if phase should be unlocked
    if (completed && phase === userProfile.current_phase) {
      // Check if all exercises in current phase are completed
      const { data: phaseExercises, error: phaseError } = await supabaseAdmin
        .from('workbook_progress')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('phase', phase)

      if (!phaseError && phaseExercises) {
        const allCompleted = phaseExercises.every((ex) => ex.completed)
        if (allCompleted && phase < 10) {
          // Unlock next phase
          await supabaseAdmin
            .from('user_profiles')
            .update({ current_phase: phase + 1 })
            .eq('id', userProfile.id)
        }
      }
    }

    return NextResponse.json({ data: progress }, { status: 200 })
  } catch (error) {
    console.error('Workbook progress API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to save workbook progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET /api/workbook/progress - Get user's workbook progress
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
    const phase = searchParams.get('phase')

    // Build query
    let query = supabaseAdmin
      .from('workbook_progress')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('phase', { ascending: true })
      .order('exercise_key', { ascending: true })

    if (phase) {
      const phaseNum = parseInt(phase)
      if (phaseNum >= 1 && phaseNum <= 10) {
        query = query.eq('phase', phaseNum)
      }
    }

    const { data: progress, error } = await query

    if (error) {
      console.error('Error fetching workbook progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ data: progress, current_phase: userProfile.current_phase })
  } catch (error) {
    console.error('Workbook progress API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch workbook progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

