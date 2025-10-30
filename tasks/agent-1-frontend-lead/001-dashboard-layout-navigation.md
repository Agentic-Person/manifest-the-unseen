# Task 001 - Dashboard Layout & Navigation

**Status:** [ ] Not Started - REQUIRES PUPPETEER MCP SERVER (for testing)

**Week/Phase:** Week 2

**Agent:** Agent 1 - Frontend Lead

**MCP Servers Used:**
- [ ] Whop MCP
- [ ] Supabase MCP
- [ ] Pipedream MCP
- [X] Puppeteer MCP - **REQUIRED** (for UI testing)

---

### Description

Create the main dashboard layout with navigation to all four pillars. Implement Tibetan monk aesthetic (earthy tones, minimal design, contemplative spacing). Build sidebar navigation with Frosted UI components.

---

### Technical Approach

Use Next.js App Router layouts with Tailwind CSS custom theme for Tibetan aesthetic. Implement responsive sidebar navigation. Use **Puppeteer MCP** to test navigation flows and visual consistency.

---

### Implementation Steps

1. Create custom Tailwind theme with monk color palette
2. Build root layout (`app/layout.tsx`)
3. Create customer dashboard layout (`app/customer/[experienceId]/layout.tsx`)
4. Build sidebar navigation component
5. Create navigation items for all four pillars
6. Implement responsive design (mobile hamburger menu)
7. Add user profile section in sidebar
8. Create dashboard home page (`app/customer/[experienceId]/home/page.tsx`)
9. Use Puppeteer MCP to test navigation and screenshots
10. Validate Tibetan aesthetic consistency

---

### Code/Files Created

**Files:**
- `app/layout.tsx` - Root layout
- `app/customer/[experienceId]/layout.tsx` - Customer area layout
- `components/navigation/Sidebar.tsx` - Main navigation
- `components/ui/Logo.tsx` - App logo (Tibetan-inspired)
- `app/customer/[experienceId]/home/page.tsx` - Dashboard home
- `tailwind.config.ts` - Custom theme configuration

**Tailwind Theme:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        monk: {
          stone: '#8B7355',      // Warm stone brown
          sand: '#D4C5B0',       // Sandy beige
          sage: '#9CAF88',       // Muted sage green
          clay: '#A0826D',       // Terracotta clay
          ash: '#78716C',        // Warm gray
          charcoal: '#4A4542',   // Dark charcoal
          cream: '#F5F1EA',      // Soft cream
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

**Sidebar Component:**

```typescript
// components/navigation/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string; // Icon name or emoji
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/customer/home', icon: '🏠' },
  { name: 'AI Mentor', href: '/customer/mentor', icon: '🧘' },
  { name: 'Workbook', href: '/customer/workbook', icon: '📖' },
  { name: 'Journal', href: '/customer/journal', icon: '✍️' },
  { name: 'Meditations', href: '/customer/meditations', icon: '🎵' },
  { name: 'Profile', href: '/customer/profile', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-monk-cream border-r border-monk-sand fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-monk-sand">
        <h1 className="text-2xl font-serif text-monk-charcoal">
          Manifest the Unseen
        </h1>
        <p className="text-sm text-monk-ash mt-1">Journey within</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive
                  ? 'bg-monk-stone text-white'
                  : 'text-monk-charcoal hover:bg-monk-sand'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-monk-sand">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-monk-sage flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-medium text-monk-charcoal">User Name</p>
            <p className="text-xs text-monk-ash">Seeker</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

---

### Testing Checklist

- [ ] Navigation renders correctly
- [ ] All nav links navigate to correct routes
- [ ] Active state highlights current page
- [ ] Responsive design works on mobile
- [ ] Tibetan aesthetic colors applied correctly
- [ ] Typography is readable and calm
- [ ] Spacing creates contemplative feel
- [ ] Puppeteer MCP screenshots confirm visual consistency
- [ ] Sidebar fixed position works on scroll

---

### Dependencies

**Blocked by:**
- Task 001 (Agent 2 - Next.js initialization)
- Task 003 (Agent 2 - Whop OAuth for user data)

**Blocks:**
- All other Agent 1 UI tasks
- User cannot navigate app without this

**External Dependencies:**
- Tailwind CSS
- Next.js App Router
- Puppeteer MCP for testing

---

### Notes for Junior Developer

**What needs to be built:**
The dashboard is the user's home base. Clean, calm, minimal navigation that embodies the Tibetan monk aesthetic.

**Tibetan Monk Aesthetic Principles:**
- **Colors:** Earthy, muted, natural (no bright blues/reds)
- **Typography:** Readable, spacious, not condensed
- **Spacing:** Generous whitespace, never cramped
- **Animations:** Slow, gentle transitions (200-300ms)
- **Icons:** Simple, contemplative (use emojis or simple SVGs)

**Layout Structure:**
- Fixed sidebar (desktop)
- Hamburger menu (mobile)
- Main content area with padding
- User profile in bottom of sidebar

**Common pitfalls:**
1. **Colors too bright:** Stick to muted, earthy tones
2. **Too much visual noise:** Keep it minimal
3. **Rushed animations:** Slow down transitions
4. **Small touch targets:** Make nav items at least 44px tall for mobile
5. **Forgetting active states:** Users need to know where they are

**Future improvements:**
- Add progress indicators in sidebar
- Show current phase number
- Add notification badges
- Implement quick actions menu
- Add dark mode toggle (earthy dark theme)

**Resources:**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

---

### Completion Notes

**Date Completed:** [To be tracked]

**Time Spent:** [To be tracked]

**Final Status:** Not Started - Waiting for Agent 2 foundation

**Handoff Notes:**
This sets the visual tone for the entire app. Take time to refine the aesthetic. Use Puppeteer MCP to capture screenshots and validate consistency across different viewports.

The Tibetan monk vibe should be immediately felt: calm, grounded, timeless.
