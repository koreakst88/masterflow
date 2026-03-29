import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MASTER } from '../config/master.config'
import { useUser } from '../context/UserContext'
import { useTelegram } from '../hooks/useTelegram'

const DEMO_STATS = {
  visits: 4,
  totalSpent: 26000,
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { client } = useUser()
  const { user } = useTelegram()
  const firstName = client?.name?.split(' ')[0] ?? 'Гость'
  const username = client?.username ? `@${client.username}` : ''
  const isMaster = client?.tg_id === MASTER.master_tg_id || true
  const photoUrl = user?.photo_url
  const [avatarError, setAvatarError] = useState(false)

  return (
    <div className="min-h-screen pb-24" style={{ background: MASTER.bg }}>
      {/* HEADER */}
      <div className="px-4 pb-2 pt-4">
        <h1 className="text-base font-medium" style={{ color: '#3d2a2a' }}>
          Профиль
        </h1>
      </div>

      {/* АВАТАР + ИМЯ */}
      <div className="flex flex-col items-center gap-3 py-6">
        <div
          className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-medium"
          style={{ background: '#FBEAF0', color: MASTER.accent, border: '2px solid #F4C0D1' }}
        >
          {photoUrl && !avatarError ? (
            <img
              src={photoUrl}
              alt={firstName}
              className="h-full w-full object-cover"
              onError={(e) => {
                setAvatarError(true)
              }}
            />
          ) : (
            firstName.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="text-center">
          <p className="text-base font-medium" style={{ color: '#3d2a2a' }}>
            {firstName}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
            {username}
          </p>
        </div>
      </div>

      {/* СТАТИСТИКА */}
      <div className="mb-4 grid grid-cols-2 gap-3 px-4">
        <div
          className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4"
          style={{ border: '0.5px solid #F0D8D8' }}
        >
          <p className="text-2xl font-medium" style={{ color: MASTER.accent }}>
            {DEMO_STATS.visits}
          </p>
          <p className="text-xs" style={{ color: '#b89898' }}>визита</p>
        </div>
        <div
          className="flex flex-col items-center gap-1 rounded-2xl bg-white p-4"
          style={{ border: '0.5px solid #F0D8D8' }}
        >
          <p className="text-2xl font-medium" style={{ color: MASTER.accent }}>
            {MASTER.currency}{DEMO_STATS.totalSpent.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: '#b89898' }}>потрачено</p>
        </div>
      </div>

      {/* МЕНЮ */}
      <div className="flex flex-col gap-2 px-4">
        {[
          ...(isMaster ? [{
            icon: '📊',
            label: 'Панель мастера',
            action: () => navigate('/master'),
          }] : []),
          { icon: '📋', label: 'Мои записи', action: () => navigate('/bookings') },
          { icon: '💅', label: 'Каталог услуг', action: () => navigate('/catalog') },
          {
            icon: '📞',
            label: 'Связаться с мастером',
            action: () => window.open(`https://t.me/${MASTER.studio}`, '_blank'),
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-sm"
            style={{ border: '0.5px solid #F0D8D8', color: '#3d2a2a' }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            <span style={{ color: '#b89898' }}>→</span>
          </button>
        ))}
      </div>

      <div className="mt-5 px-4">
        <div
          className="rounded-3xl p-4"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #FBEAF0 100%)',
            border: '1px solid #F4C0D1',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
              style={{ background: MASTER.accent, color: '#fff' }}
            >
              💬
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
                Понравилось приложение?
              </p>
              <p className="mt-1 text-xs leading-5" style={{ color: '#b89898' }}>
                Могу сделать Telegram Mini App для вашего бизнеса
              </p>
            </div>
          </div>

          <button
            onClick={() => window.open('https://t.me/koreakim88', '_blank')}
            className="mt-4 w-full rounded-2xl py-3 text-sm font-medium"
            style={{ background: MASTER.accent, color: '#fff' }}
          >
            Связаться с разработчиком
          </button>
        </div>
      </div>

      {/* СТУДИЯ */}
      <div className="mt-8 flex flex-col items-center gap-1 pb-4">
        <span style={{ fontSize: '24px' }}>{MASTER.logo_emoji}</span>
        <p className="text-xs font-medium" style={{ color: MASTER.accent }}>
          {MASTER.studio}
        </p>
      </div>
    </div>
  )
}
