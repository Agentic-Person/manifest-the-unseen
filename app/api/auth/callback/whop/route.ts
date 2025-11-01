import { NextRequest, NextResponse } from 'next/server'
import { whopConfig } from '@/lib/whop'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const experienceId = searchParams.get('state') // Whop passes experienceId as state

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    )
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.whop.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: whopConfig.clientId,
        client_secret: whopConfig.clientSecret,
        redirect_uri: whopConfig.redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error('Token exchange failed:', error)
      throw new Error('Failed to exchange authorization code')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch user info from Whop API
    const userResponse = await fetch('https://api.whop.com/api/v5/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      const error = await userResponse.text()
      console.error('User info fetch failed:', error)
      throw new Error('Failed to fetch user info')
    }

    const whopUser = await userResponse.json()
    const whopUserId = whopUser.id

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('whop_user_id', whopUserId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.error('Error fetching user profile:', fetchError)
      throw fetchError
    }

    if (!existingUser) {
      // Create new user profile with default values
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          whop_user_id: whopUserId,
          email: whopUser.email || null,
          display_name: whopUser.username || whopUser.email || 'Seeker',
          current_phase: 1,
          signal_strength_score: 0,
          level: 'Seeker',
          journal_streak: 0,
          badges: [],
        })

      if (insertError) {
        console.error('Error creating user profile:', insertError)
        throw insertError
      }
    } else {
      // Update last_active timestamp for existing user
      await supabaseAdmin
        .from('user_profiles')
        .update({ last_active: new Date().toISOString() })
        .eq('whop_user_id', whopUserId)
    }

    // Create redirect response to customer app
    const redirectUrl = experienceId
      ? `/customer/${experienceId}`
      : '/customer/default'

    const response = NextResponse.redirect(
      new URL(redirectUrl, request.url)
    )

    // Set authentication cookies
    response.cookies.set('whop_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    response.cookies.set('whop_user_id', whopUserId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      {
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
