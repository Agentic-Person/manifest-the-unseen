'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Home', href: '', icon: '🏠' },
  { name: 'AI Mentor', href: '/mentor', icon: '🧘' },
  { name: 'Workbook', href: '/workbook', icon: '📖' },
  { name: 'Journal', href: '/journal', icon: '✍️' },
  { name: 'Meditations', href: '/meditations', icon: '🎵' },
  { name: 'Profile', href: '/profile', icon: '⚙️' },
]

export function Navigation({ experienceId }: { experienceId: string }) {
  const pathname = usePathname()
  const basePath = `/customer/${experienceId}`

  return (
    <nav className="bg-monk-burgundy-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={basePath} className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <span className="text-2xl font-serif">Manifest the Unseen</span>
            <span className="text-sm opacity-75 font-light hidden sm:inline">Journey within</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const href = `${basePath}${item.href}`
              const isActive = pathname === href || (item.href !== '' && pathname?.startsWith(href))
              
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap
                    transition-all duration-200 ease-in-out
                    ${isActive
                      ? 'bg-monk-gold-500 text-monk-burgundy-900 font-medium'
                      : 'text-white hover:bg-monk-burgundy-600 hover:text-monk-gold-200'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm hidden sm:inline">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

