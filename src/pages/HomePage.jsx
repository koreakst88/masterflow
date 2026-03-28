import { useNavigate } from 'react-router-dom'
import { MASTER } from '../config/master.config'
import { useUser } from '../context/UserContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { client } = useUser()
  const firstName = client?.name?.split(' ')[0] ?? 'Гость'

  return (
    <div className="min-h-screen pb-24" style={{ background: MASTER.bg }}>
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div
          className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-xl"
          style={{ background: '#FBEAF0', border: '1.5px solid #F4C0D1' }}
        >
          {MASTER.logo_emoji}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium" style={{ color: MASTER.accent }}>
            Привет, {firstName}! 👋
          </h2>
          <p className="text-xs" style={{ color: '#b89898' }}>
            {MASTER.greeting}
          </p>
        </div>
        <div
          className="h-9 w-9 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ background: '#FBEAF0', color: MASTER.accent, border: '1px solid #F4C0D1' }}
        >
          {firstName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* BANNER */}
      <div
        className="relative mx-4 mt-2 overflow-hidden rounded-2xl p-4"
        style={{ background: MASTER.accent, minHeight: '100px' }}
      >
        <div className="absolute right-[-8px] top-[-8px] h-24 w-24 rounded-full opacity-20" style={{ background: '#fff' }} />
        <div className="absolute bottom-[-16px] right-6 h-16 w-16 rounded-full opacity-20" style={{ background: '#fff' }} />
        <h3 className="relative z-10 text-base font-medium leading-snug text-white">
          {MASTER.banner.title}
        </h3>
        <p className="relative z-10 mt-1 text-xs text-white opacity-80">
          {MASTER.banner.subtitle}
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="relative z-10 mt-3 rounded-full bg-white px-3 py-1.5 text-xs font-medium"
          style={{ color: MASTER.accent }}
        >
          {MASTER.banner.cta} →
        </button>
      </div>

      {/* БЛИЖАЙШИЕ СЛОТЫ */}
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
          ⚡ Ближайшие слоты
        </h3>
        <span className="cursor-pointer text-xs" style={{ color: MASTER.accent }}>
          Все →
        </span>
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-1">
        {['Сегодня 15:00', 'Сегодня 16:30', 'Завтра 11:00'].map((slot) => (
          <button
            key={slot}
            onClick={() => navigate('/booking')}
            className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: '#fff', border: '1px solid #F4C0D1', color: '#993556' }}
          >
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: MASTER.accent }} />
            {slot}
          </button>
        ))}
      </div>

      {/* УСЛУГИ — сетка 2x2 */}
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
          ✨ Услуги
        </h3>
        <span
          className="cursor-pointer text-xs"
          style={{ color: MASTER.accent }}
          onClick={() => navigate('/catalog')}
        >
          Все →
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {MASTER.services.map((service) => (
          <div
            key={service.id}
            onClick={() => navigate('/catalog')}
            className="cursor-pointer overflow-hidden rounded-2xl bg-white"
            style={{ border: '0.5px solid #F0D8D8' }}
          >
            <div className="h-20 w-full overflow-hidden" style={{ background: '#FBEAF0' }}>
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium leading-tight" style={{ color: '#3d2a2a' }}>
                {service.name}
              </p>
              <p className="mt-0.5 text-xs font-medium" style={{ color: MASTER.accent }}>
                {MASTER.currency}
                {service.price.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                {service.duration} мин
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ПОПУЛЯРНОЕ */}
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
          🔥 Популярное
        </h3>
      </div>
      <div className="flex flex-col gap-2 px-4">
        {MASTER.services.slice(0, 2).map((service) => (
          <div
            key={service.id}
            onClick={() => navigate('/catalog')}
            className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3"
            style={{ border: '0.5px solid #F0D8D8' }}
          >
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#FBEAF0' }}>
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium" style={{ color: '#3d2a2a' }}>
                {service.name}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                {service.duration} мин · {service.category}
              </p>
            </div>
            <p className="flex-shrink-0 text-xs font-medium" style={{ color: MASTER.accent }}>
              {MASTER.currency}
              {service.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
