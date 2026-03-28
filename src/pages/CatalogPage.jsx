import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MASTER } from '../config/master.config'
import { getServices } from '../lib/api'

export default function CatalogPage() {
  const [active, setActive] = useState('Все')
  const [services, setServices] = useState(MASTER.services)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getServices()
      .then((data) => {
        if (data?.length) setServices(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = ['Все', ...new Set(services.map((service) => service.category))]
  const filtered = active === 'Все'
    ? services
    : services.filter((service) => service.category === active)

  if (loading) {
    return (
      <div className="min-h-screen px-4 pb-24 pt-4" style={{ background: MASTER.bg }}>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-white"
              style={{ border: '0.5px solid #F0D8D8', height: '180px' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: MASTER.bg }}>
      {/* HEADER */}
      <div className="px-4 pb-2 pt-4">
        <h1 className="text-base font-medium" style={{ color: '#3d2a2a' }}>
          Каталог услуг
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
          Выберите услугу для записи
        </p>
      </div>

      {/* КАТЕГОРИИ — горизонтальный скролл */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all"
            style={{
              background: active === cat ? MASTER.accent : '#fff',
              color: active === cat ? '#fff' : '#993556',
              border: active === cat ? 'none' : '1px solid #F4C0D1',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* СПИСОК УСЛУГ — сетка 2x2 */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {filtered.map((service) => (
          <div
            key={service.id}
            onClick={() => navigate(`/booking?serviceId=${service.id}`)}
            className="cursor-pointer overflow-hidden rounded-2xl bg-white transition-transform active:scale-95"
            style={{ border: '0.5px solid #F0D8D8' }}
          >
            {/* Фото */}
            <div className="h-24 w-full overflow-hidden" style={{ background: '#FBEAF0' }}>
              <img
                src={service.image_url ?? service.image}
                alt={service.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Инфо */}
            <div className="p-3">
              <p className="text-xs font-medium leading-snug" style={{ color: '#3d2a2a' }}>
                {service.name}
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color: MASTER.accent }}>
                {MASTER.currency}
                {service.price.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs" style={{ color: '#b89898' }}>
                  {service.duration} мин
                </p>
                <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: '#FBEAF0', color: '#993556' }}>
                  {service.category}
                </span>
              </div>

              {/* Кнопка записи */}
              <button
                onClick={() => navigate(`/booking?serviceId=${service.id}`)}
                className="mt-2.5 w-full rounded-xl py-1.5 text-xs font-medium transition-opacity active:opacity-70"
                style={{ background: MASTER.accent, color: '#fff' }}
              >
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
