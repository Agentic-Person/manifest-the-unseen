import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function CustomerDashboard({
  params,
}: {
  params: { experienceId: string }
}) {
  const userProfile = await getCurrentUser()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-serif text-monk-burgundy-700 mb-4">
          Welcome to Your Manifestation Journey
        </h1>
        <p className="text-lg text-monk-brown-700 max-w-2xl mx-auto mb-6">
          A sacred space for transformation through the wisdom of ancient practices
          and the power of modern consciousness technology.
        </p>
        {userProfile && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-monk-gold-100 rounded-full">
            <span className="text-monk-burgundy-700 font-medium">
              Phase {userProfile.current_phase} • {userProfile.level}
            </span>
          </div>
        )}
      </div>

      {/* Four Pillars Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* AI Mentor Card */}
        <Link
          href={`/customer/${params.experienceId}/mentor`}
          className="bg-white rounded-lg shadow-md p-6 border border-monk-brown-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🧘</span>
            <h2 className="text-2xl font-serif text-monk-burgundy-600">
              AI Monk Mentor
            </h2>
          </div>
          <p className="text-monk-brown-700 mb-4">
            Seek guidance from your AI mentor, trained in ancient wisdom and modern manifestation principles.
          </p>
          <span className="text-monk-gold-600 hover:text-monk-gold-700 font-medium inline-flex items-center">
            Begin conversation →
          </span>
        </Link>

        {/* Workbook Card */}
        <Link
          href={`/customer/${params.experienceId}/workbook`}
          className="bg-white rounded-lg shadow-md p-6 border border-monk-brown-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-serif text-monk-burgundy-600">
              Interactive Workbook
            </h2>
          </div>
          <p className="text-monk-brown-700 mb-4">
            Progress through 10 transformative phases with structured exercises and practices.
          </p>
          {userProfile && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-monk-brown-600 mb-1">
                <span>Phase {userProfile.current_phase} of 10</span>
                <span>{(userProfile.current_phase / 10 * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-monk-brown-200 rounded-full h-2">
                <div
                  className="bg-monk-gold-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userProfile.current_phase / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
          <span className="text-monk-gold-600 hover:text-monk-gold-700 font-medium inline-flex items-center">
            Continue workbook →
          </span>
        </Link>

        {/* Journal Card */}
        <Link
          href={`/customer/${params.experienceId}/journal`}
          className="bg-white rounded-lg shadow-md p-6 border border-monk-brown-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">✍️</span>
            <h2 className="text-2xl font-serif text-monk-burgundy-600">
              Sacred Journal
            </h2>
          </div>
          <p className="text-monk-brown-700 mb-4">
            Document your journey with AI-powered insights into your patterns and progress.
          </p>
          {userProfile && userProfile.journal_streak > 0 && (
            <div className="mb-4 inline-flex items-center space-x-2 px-3 py-1 bg-monk-gold-100 rounded-full">
              <span className="text-monk-burgundy-700 text-sm font-medium">
                🔥 {userProfile.journal_streak} day streak
              </span>
            </div>
          )}
          <span className="text-monk-gold-600 hover:text-monk-gold-700 font-medium inline-flex items-center">
            Open journal →
          </span>
        </Link>

        {/* Meditations Card */}
        <Link
          href={`/customer/${params.experienceId}/meditations`}
          className="bg-white rounded-lg shadow-md p-6 border border-monk-brown-200 hover:shadow-lg transition-shadow duration-200 opacity-75"
        >
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-3xl">🎵</span>
            <h2 className="text-2xl font-serif text-monk-burgundy-600">
              Meditations
            </h2>
            <span className="text-xs bg-monk-brown-200 px-2 py-1 rounded text-monk-brown-700">
              Coming Soon
            </span>
          </div>
          <p className="text-monk-brown-700 mb-4">
            Guided meditations and audio experiences to deepen your practice. Coming soon.
          </p>
        </Link>
      </div>
    </div>
  )
}
