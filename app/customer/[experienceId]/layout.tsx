import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyWhopMembership } from '@/lib/whop'
import { getWhopAuthUrl } from '@/lib/auth'
import { Navigation } from '@/components/navigation/Navigation'

export default async function CustomerLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { experienceId: string }
}) {
  const cookieStore = await cookies()
  const whopUserId = cookieStore.get('whop_user_id')?.value

  // If no user session, redirect to Whop OAuth
  if (!whopUserId) {
    const whopAuthUrl = getWhopAuthUrl(params.experienceId)
    redirect(whopAuthUrl)
  }

  // Verify membership is still active
  const user = await verifyWhopMembership(whopUserId)

  if (!user) {
    // Session expired or membership invalid, redirect to login
    const whopAuthUrl = getWhopAuthUrl(params.experienceId)
    redirect(whopAuthUrl)
  }

  return (
    <div className="min-h-screen bg-monk-brown-50">
      <Navigation experienceId={params.experienceId} />
      
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}
