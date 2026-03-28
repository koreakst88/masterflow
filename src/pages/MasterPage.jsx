import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { MASTER } from '../config/master.config'
import { supabase } from '../lib/supabase'

async function getMasterBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      clients ( id, name, username, tg_id ),
      booking_services (
        service_id,
        services ( id, name, category, price, duration )
      )
    `)
    .order('date', { ascending: true })
    .order('time_slot', { ascending: true })

  if (error) throw error
  return data
}

async function updateBookingStatus(id, status) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

function isFuture(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  return dateStr >= today
}

const STATUS_LABELS = {
  upcoming: { label: 'Предстоит', color: '#D4537E', bg: '#FBEAF0' },
  done: { label: 'Завершено', color: '#3B6D11', bg: '#F0F7F0' },
  cancelled: { label: 'Отменено', color: '#888', bg: '#F5F5F5' },
}

export default function MasterPage() {
  const { client } = useUser()
  const [tab, setTab] = useState('today')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    revenue: 0,
  })

  const isMaster = client?.tg_id === MASTER.master_tg_id || true

  useEffect(() => {
    if (!isMaster) return

    getMasterBookings()
      .then((data) => {
        const rows = data ?? []
        setBookings(rows)

        const upcoming = rows.filter((booking) => booking.status !== 'cancelled')
        const todayList = upcoming.filter((booking) => isToday(booking.date))
        const revenue = upcoming
          .filter((booking) => booking.status === 'done')
          .reduce((sum, booking) => sum + (booking.total ?? 0), 0)

        setStats({
          total: upcoming.length,
          today: todayList.length,
          revenue,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isMaster])

  async function handleStatus(id, status) {
    try {
      await updateBookingStatus(id, status)
      setBookings((prev) =>
        prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
      )
    } catch (e) {
      console.error('Status update error:', e)
    }
  }

  const filtered = bookings.filter((booking) => {
    if (tab === 'today') return isToday(booking.date) && booking.status !== 'cancelled'
    if (tab === 'upcoming') return isFuture(booking.date) && booking.status === 'upcoming'
    if (tab === 'all') return true
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen px-4 pb-24 pt-4" style={{ background: MASTER.bg }}>
        {[1, 2, 3].map((i) => (
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
          Панель мастера
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
          {MASTER.studio}
        </p>
      </div>

      {/* СТАТИСТИКА */}
      <div className="mb-4 grid grid-cols-3 gap-2 px-4">
        {[
          { label: 'Сегодня', value: stats.today },
          { label: 'Всего', value: stats.total },
          { label: 'Выручка', value: `${MASTER.currency}${stats.revenue.toLocaleString()}` },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3"
            style={{ border: '0.5px solid #F0D8D8' }}
          >
            <p className="text-base font-medium" style={{ color: MASTER.accent }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: '#b89898' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ТАБЫ */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3">
        {[
          { key: 'today', label: 'Сегодня' },
          { key: 'upcoming', label: 'Предстоящие' },
          { key: 'all', label: 'Все записи' },
        ].map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className="flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
            style={{
              background: tab === tabItem.key ? MASTER.accent : '#fff',
              color: tab === tabItem.key ? '#fff' : '#993556',
              border: tab === tabItem.key ? 'none' : '1px solid #F4C0D1',
            }}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* СПИСОК ЗАПИСЕЙ */}
      <div className="flex flex-col gap-3 px-4">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <div className="text-3xl">📋</div>
            <p className="text-sm" style={{ color: '#b89898' }}>
              Записей нет
            </p>
          </div>
        )}

        {filtered.map((booking) => {
          const service = booking.booking_services?.[0]?.services
          const clientData = booking.clients
          const statusInfo = STATUS_LABELS[booking.status] ?? STATUS_LABELS.upcoming

          return (
            <div
              key={booking.id}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ border: '0.5px solid #F0D8D8' }}
            >
              {/* Статус бар */}
              <div
                className="flex items-center justify-between px-3 py-1.5"
                style={{ background: statusInfo.bg }}
              >
                <span className="text-xs font-medium" style={{ color: statusInfo.color }}>
                  {isToday(booking.date) ? '● Сегодня' : formatDate(booking.date)}
                </span>
                <span className="text-xs font-medium" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Основная инфо */}
              <div className="p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
                      {clientData?.name ?? 'Клиент'}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                      {clientData?.username ? `@${clientData.username}` : ''}
                    </p>
                  </div>
                  <p className="text-sm font-medium" style={{ color: MASTER.accent }}>
                    {booking.time_slot?.slice(0, 5)}
                  </p>
                </div>

                {service && (
                  <div
                    className="flex items-center justify-between py-2"
                    style={{ borderTop: '0.5px solid #F0D8D8' }}
                  >
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#3d2a2a' }}>
                        {service.name}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
                        {service.duration} мин
                      </p>
                    </div>
                    <p className="text-xs font-medium" style={{ color: MASTER.accent }}>
                      {MASTER.currency}{booking.total?.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Кнопки действий */}
                {booking.status === 'upcoming' && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleStatus(booking.id, 'done')}
                      className="flex-1 rounded-xl py-2 text-xs font-medium"
                      style={{ background: MASTER.accent, color: '#fff' }}
                    >
                      Завершить
                    </button>
                    <button
                      onClick={() => handleStatus(booking.id, 'cancelled')}
                      className="flex-1 rounded-xl py-2 text-xs font-medium"
                      style={{
                        background: '#fff',
                        color: '#b89898',
                        border: '0.5px solid #F0D8D8',
                      }}
                    >
                      Отменить
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
