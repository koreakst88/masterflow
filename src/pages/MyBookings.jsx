import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MASTER } from '../config/master.config'
import { useUser } from '../context/UserContext'
import { cancelBooking, getClientBookings } from '../lib/api'

function formatDateFull(d) {
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function MyBookings() {
  const navigate = useNavigate()
  const { client } = useUser()
  const [tab, setTab] = useState('upcoming')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const filtered = bookings.filter((b) => b.status === tab)

  useEffect(() => {
    if (!client?.id) {
      setLoading(false)
      return
    }

    setLoading(true)
    getClientBookings(client.id)
      .then((data) => setBookings(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [client?.id])

  async function handleCancel(id) {
    try {
      await cancelBooking(id)
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
    } catch (e) {
      console.error('Cancel error:', e)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen px-4 pb-24 pt-4" style={{ background: MASTER.bg }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="mb-3 animate-pulse rounded-2xl bg-white"
            style={{ border: '0.5px solid #F0D8D8', height: '120px' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: MASTER.bg }}>
      {/* HEADER */}
      <div className="px-4 pb-2 pt-4">
        <h1 className="text-base font-medium" style={{ color: '#3d2a2a' }}>
          Мои записи
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
          История и предстоящие визиты
        </p>
      </div>

      {/* ТАБЫ */}
      <div className="flex gap-2 px-4 pb-3">
        {[
          { key: 'upcoming', label: 'Предстоящие' },
          { key: 'done', label: 'Завершённые' },
          { key: 'cancelled', label: 'Отменённые' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: tab === t.key ? MASTER.accent : '#fff',
              color: tab === t.key ? '#fff' : '#993556',
              border: tab === t.key ? 'none' : '1px solid #F4C0D1',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* СПИСОК */}
      <div className="flex flex-col gap-3 px-4">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="text-4xl">🌸</div>
            <p className="text-center text-sm" style={{ color: '#b89898' }}>
              {tab === 'upcoming'
                ? 'Нет предстоящих записей'
                : tab === 'done'
                  ? 'Нет завершённых записей'
                  : 'Нет отменённых записей'}
            </p>
            {tab === 'upcoming' && (
              <button
                onClick={() => navigate('/catalog')}
                className="mt-2 rounded-2xl px-6 py-2.5 text-sm font-medium"
                style={{ background: MASTER.accent, color: '#fff' }}
              >
                Записаться
              </button>
            )}
          </div>
        )}

        {filtered.map((booking) => {
          const service = booking.booking_services?.[0]?.services
          if (!service) return null
          const imageUrl = service.image_url ?? `/images/${service.category.toLowerCase()}.jpg`

          return (
            <div
              key={booking.id}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ border: '0.5px solid #F0D8D8' }}
            >
              {/* Верхняя часть — статус */}
              <div
                className="flex items-center justify-between px-3 py-1.5"
                style={{
                  background:
                    booking.status === 'upcoming'
                      ? '#FBEAF0'
                      : booking.status === 'done'
                        ? '#F0F7F0'
                        : '#F5F5F5',
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color:
                      booking.status === 'upcoming'
                        ? MASTER.accent
                        : booking.status === 'done'
                          ? '#3B6D11'
                          : '#888',
                  }}
                >
                  {booking.status === 'upcoming'
                    ? '● Предстоит'
                    : booking.status === 'done'
                      ? '✓ Завершено'
                      : '✕ Отменено'}
                </span>
                <span className="text-xs" style={{ color: '#b89898' }}>
                  #{booking.id}
                </span>
              </div>

              {/* Основная часть */}
              <div className="flex items-center gap-3 p-3">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#FBEAF0' }}>
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
                    {service.name}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                    {formatDateFull(new Date(booking.date))}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                    {booking.time_slot?.slice(0, 5)} · {service.duration} мин
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: MASTER.accent }}>
                    {MASTER.currency}{service.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Кнопка отмены — только для предстоящих */}
              {booking.status === 'upcoming' && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full rounded-xl py-2 text-xs font-medium"
                    style={{
                      background: '#fff',
                      color: '#b89898',
                      border: '0.5px solid #F0D8D8',
                    }}
                  >
                    Отменить запись
                  </button>
                </div>
              )}

              {/* Повторить — только для завершённых */}
              {booking.status === 'done' && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => navigate(`/booking?serviceId=${service.id}`)}
                    className="w-full rounded-xl py-2 text-xs font-medium"
                    style={{ background: MASTER.accent, color: '#fff' }}
                  >
                    Записаться снова
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
