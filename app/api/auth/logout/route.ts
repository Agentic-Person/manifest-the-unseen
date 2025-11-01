import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  // Delete authentication cookies
  response.cookies.delete('whop_access_token')
  response.cookies.delete('whop_user_id')

  return response
}

// Also support GET for simple logout links
export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))

  // Delete authentication cookies
  response.cookies.delete('whop_access_token')
  response.cookies.delete('whop_user_id')

  return response
}
