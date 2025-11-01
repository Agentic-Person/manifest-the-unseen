import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { verifyWhopMembership } from './whop'

export function getWhopAuthUrl(experienceId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/auth/callback/whop`
  const clientId = process.env.WHOP_CLIENT_ID || ''
  
  return `https://whop.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${experienceId}&scope=read_user`
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const whopUserId = cookieStore.get('whop_user_id')?.value

  if (!whopUserId) {
    return null
  }

  const { data: userProfile, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('whop_user_id', whopUserId)
    .single()

  if (error || !userProfile) {
    return null
  }

  return userProfile
}

export interface AuthResult {
  authenticated: boolean
  error?: string
  user?: any
  whopUserId?: string
  accessToken?: string
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const accessToken = request.cookies.get('whop_access_token')?.value
  const whopUserId = request.cookies.get('whop_user_id')?.value

  if (!accessToken || !whopUserId) {
    return {
      authenticated: false,
      error: 'No valid session',
    }
  }

  const user = await verifyWhopMembership(whopUserId)

  if (!user) {
    return {
      authenticated: false,
      error: 'Invalid or expired membership',
    }
  }

  return {
    authenticated: true,
    user,
    whopUserId,
    accessToken,
  }
}

export function withAuth(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const auth = await requireAuth(request)

    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request, { ...context, auth })
  }
}
