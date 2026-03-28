import { NavLink } from 'react-router-dom'

const items = [
  {
    label: 'Главная',
    to: '/',
    icon: (
      <path d="M3 11.5 12 4l9 7.5v7.5a1 1 0 0 1-1 1h-4.5v-6h-7v6H4a1 1 0 0 1-1-1z" />
    ),
  },
  {
    label: 'Услуги',
    to: '/catalog',
    icon: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </>
    ),
  },
  {
    label: 'Записи',
    to: '/bookings',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
  },
  {
    label: 'Профиль',
    to: '/profile',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c1.8-3.7 4.4-5.5 7-5.5S16.2 16.3 19 20" />
      </>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[430px] border-t border-brand-border bg-white">
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 py-3 text-[12px] font-medium transition-colors',
                isActive ? 'text-brand-pink' : 'text-brand-muted',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill={isActive ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
