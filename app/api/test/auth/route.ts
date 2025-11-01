/**
 * Test API Route for OAuth Authentication
 *
 * This route tests the authentication middleware and returns
 * the authenticated user's information.
 *
 * Usage:
 *   GET /api/test/auth
 *
 * Returns:
 *   - 401 if not authenticated
 *   - 200 with user info if authenticated
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'

async function handler(request: NextRequest, context: any) {
  const { auth } = context

  return NextResponse.json({
    success: true,
    message: 'Authentication successful!',
    user: {
      whopUserId: auth.whopUserId,
      username: auth.user?.username || null,
      email: auth.user?.email || null,
    },
    timestamp: new Date().toISOString()
  })
}

// Export GET method wrapped with authentication middleware
export const GET = withAuth(handler)
