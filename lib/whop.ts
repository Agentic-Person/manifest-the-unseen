// Whop SDK utilities for OAuth and API integration

// Initialize Whop SDK - simplified for direct API calls
const whopApiKey = process.env.WHOP_API_KEY!
const whopClientId = process.env.WHOP_CLIENT_ID!
const whopClientSecret = process.env.WHOP_CLIENT_SECRET!

export const whopConfig = {
  apiKey: whopApiKey,
  clientId: whopClientId,
  clientSecret: whopClientSecret,
  redirectUri: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/api/auth/callback/whop',
}

// Helper to verify Whop user and membership status via direct API call
export async function verifyWhopMembership(userId: string) {
  try {
    // Use direct API call instead of SDK for now
    const response = await fetch(`https://api.whop.com/api/v5/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${whopApiKey}`,
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error verifying Whop membership:', error)
    return null
  }
}
