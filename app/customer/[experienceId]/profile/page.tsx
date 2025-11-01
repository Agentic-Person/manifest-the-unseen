import { getCurrentUser } from '@/lib/auth'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ProfilePage({
  params,
}: {
  params: { experienceId: string }
}) {
  const userProfile = await getCurrentUser()

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-center py-12 text-monk-brown-600">User profile not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif text-monk-burgundy-700 mb-2">
          Your Profile
        </h1>
        <p className="text-monk-brown-600">
          Track your progress, view achievements, and manage your practice settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md border border-monk-brown-200 p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-monk-burgundy-600 flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.display_name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-serif text-monk-burgundy-700">
              {userProfile.display_name || 'Seeker'}
            </h2>
            <p className="text-monk-brown-600">{userProfile.email}</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-monk-brown-50 rounded-lg p-4 border border-monk-brown-200">
            <div className="text-sm text-monk-brown-600 mb-1">Current Phase</div>
            <div className="text-2xl font-serif text-monk-burgundy-700">
              {userProfile.current_phase} / 10
            </div>
          </div>

          <div className="bg-monk-brown-50 rounded-lg p-4 border border-monk-brown-200">
            <div className="text-sm text-monk-brown-600 mb-1">Level</div>
            <div className="text-2xl font-serif text-monk-burgundy-700">
              {userProfile.level}
            </div>
          </div>

          <div className="bg-monk-brown-50 rounded-lg p-4 border border-monk-brown-200">
            <div className="text-sm text-monk-brown-600 mb-1">Journal Streak</div>
            <div className="text-2xl font-serif text-monk-burgundy-700">
              {userProfile.journal_streak} days
            </div>
          </div>
        </div>

        {/* Signal Strength */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-monk-burgundy-700">
              Signal Strength Score
            </span>
            <span className="text-lg font-medium text-monk-gold-600">
              {userProfile.signal_strength_score} / 100
            </span>
          </div>
          <div className="w-full bg-monk-brown-200 rounded-full h-3">
            <div
              className="bg-monk-gold-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${userProfile.signal_strength_score}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        {userProfile.badges && Array.isArray(userProfile.badges) && userProfile.badges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-serif text-monk-burgundy-700 mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.badges.map((badge: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-monk-gold-100 text-monk-burgundy-700 rounded-full text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="pt-6 border-t border-monk-brown-200">
          <h3 className="text-lg font-serif text-monk-burgundy-700 mb-3">Account Information</h3>
          <div className="space-y-2 text-sm text-monk-brown-700">
            <div className="flex justify-between">
              <span>Member since:</span>
              <span>{new Date(userProfile.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last active:</span>
              <span>{new Date(userProfile.last_active).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Whop User ID:</span>
              <span className="font-mono text-xs">{userProfile.whop_user_id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="text-center">
        <Link
          href="/api/auth/logout"
          className="inline-block px-6 py-3 bg-monk-brown-200 text-monk-brown-700 rounded-lg hover:bg-monk-brown-300 transition-colors duration-200"
        >
          Logout
        </Link>
      </div>
    </div>
  )
}
