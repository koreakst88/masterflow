import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MASTER } from '../config/master.config'
import { useUser } from '../context/UserContext'
import { createBooking, getBookedSlots } from '../lib/api'
import { notifyMaster } from '../lib/notify'
import { useTelegram } from '../hooks/useTelegram'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

function getDates() {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

function formatDateFull(d) {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isToday(d) {
  const t = new Date()
  return d.toDateString() === t.toDateString()
}

export default function BookingPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { client } = useUser()
  const { tg } = useTelegram()

  const serviceId = parseInt(params.get('serviceId'), 10) || MASTER.services[0].id
  const service = MASTER.services.find((s) => s.id === serviceId) || MASTER.services[0]

  const dates = getDates()
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [selectedTime, setSelectedTime] = useState(null)
  const [step, setStep] = useState('booking')
  const [bookedSlots, setBookedSlots] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    setBookedSlots([])
    getBookedSlots(dateStr)
      .then((slots) => setBookedSlots(slots))
      .catch(() => setBookedSlots([]))
  }, [selectedDate])

  function handleShare() {
    const text = `Записалась на ${service.name} ${selectedTime}`
    tg?.switchInlineQuery?.(text) ??
      window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank')
  }

  async function handleConfirm() {
    if (!selectedTime) return
    setSaving(true)
    setError(null)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      await createBooking({
        clientId: client?.id > 0 ? client.id : null,
        serviceIds: [service.id],
        date: dateStr,
        timeSlot: selectedTime,
        total: service.price,
      })

      notifyMaster({
        service,
        date: dateStr,
        time: selectedTime,
        clientName: client.name ?? 'Гость',
        total: service.price,
        currency: MASTER.currency,
      }).catch(() => {})

      setStep('success')
    } catch (e) {
      setError('Не удалось создать запись. Попробуйте ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  if (step === 'success') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 pb-24"
        style={{ background: MASTER.bg }}
      >
        <div className="mb-4 text-5xl">🌸</div>
        <h2 className="mb-2 text-center text-lg font-medium" style={{ color: '#3d2a2a' }}>
          Вы записаны!
        </h2>
        <div className="mt-4 w-full rounded-2xl bg-white p-4" style={{ border: '0.5px solid #F0D8D8' }}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: '#b89898' }}>Услуга</span>
              <span className="font-medium" style={{ color: '#3d2a2a' }}>{service.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#b89898' }}>Дата</span>
              <span className="font-medium" style={{ color: '#3d2a2a' }}>{formatDateFull(selectedDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#b89898' }}>Время</span>
              <span className="font-medium" style={{ color: '#3d2a2a' }}>{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#b89898' }}>Длительность</span>
              <span className="font-medium" style={{ color: '#3d2a2a' }}>{service.duration} мин</span>
            </div>
            <div className="flex justify-between pt-2 text-sm" style={{ borderTop: '0.5px solid #F0D8D8' }}>
              <span style={{ color: '#b89898' }}>Стоимость</span>
              <span className="font-medium" style={{ color: MASTER.accent }}>
                {MASTER.currency}{service.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/bookings')}
          className="mt-6 w-full rounded-2xl py-3 text-sm font-medium"
          style={{ background: MASTER.accent, color: '#fff' }}
        >
          Мои записи
        </button>
        <button
          onClick={() => navigate('/')}
          className="mt-3 w-full rounded-2xl py-3 text-sm font-medium"
          style={{ background: '#fff', color: MASTER.accent, border: '1px solid #F4C0D1' }}
        >
          На главную
        </button>
        <button
          onClick={handleShare}
          className="mt-3 w-full rounded-2xl py-3 text-sm font-medium"
          style={{
            background: '#fff',
            color: '#b89898',
            border: '1px solid #F4C0D1',
          }}
        >
          Поделиться 🌸
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: MASTER.bg }}>
      {/* HEADER */}
      <div className="px-4 pb-2 pt-4">
        <h1 className="text-base font-medium" style={{ color: '#3d2a2a' }}>
          Запись на услугу
        </h1>
      </div>

      {/* КАРТОЧКА УСЛУГИ */}
      <div className="mx-4 overflow-hidden rounded-2xl bg-white" style={{ border: '0.5px solid #F0D8D8' }}>
        <div className="flex items-center gap-3 p-3">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#FBEAF0' }}>
            <img
              src={service.image_url ?? service.image}
              alt={service.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: '#3d2a2a' }}>
              {service.name}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: '#b89898' }}>
              {service.duration} мин · {service.category}
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: MASTER.accent }}>
              {MASTER.currency}{service.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* КАЛЕНДАРЬ */}
      <div className="px-4 pb-2 pt-4">
        <h3 className="mb-3 text-sm font-medium" style={{ color: '#3d2a2a' }}>
          Выберите дату
        </h3>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedDate(d)
                setSelectedTime(null)
              }}
              className="flex flex-shrink-0 flex-col items-center rounded-xl px-3 py-2 transition-all"
              style={{
                background: selectedDate.toDateString() === d.toDateString() ? MASTER.accent : '#fff',
                color: selectedDate.toDateString() === d.toDateString() ? '#fff' : '#3d2a2a',
                border: selectedDate.toDateString() === d.toDateString() ? 'none' : '0.5px solid #F0D8D8',
                minWidth: '52px',
              }}
            >
              <span className="text-xs opacity-70">
                {isToday(d) ? 'Сег' : d.toLocaleDateString('ru-RU', { weekday: 'short' })}
              </span>
              <span className="mt-0.5 text-sm font-medium">
                {d.getDate()}
              </span>
              <span className="text-xs opacity-70">
                {d.toLocaleDateString('ru-RU', { month: 'short' })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* СЛОТЫ ВРЕМЕНИ */}
      <div className="px-4 pb-4 pt-2">
        <h3 className="mb-3 text-sm font-medium" style={{ color: '#3d2a2a' }}>
          Выберите время
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => {
            const blocked = bookedSlots.includes(time)
            const selected = selectedTime === time
            return (
              <button
                key={time}
                disabled={blocked}
                onClick={() => setSelectedTime(time)}
                className="rounded-xl py-2 text-xs font-medium transition-all"
                style={{
                  background: blocked ? '#F5F5F5' : selected ? MASTER.accent : '#fff',
                  color: blocked ? '#ccc' : selected ? '#fff' : '#3d2a2a',
                  border: blocked ? 'none' : selected ? 'none' : '0.5px solid #F0D8D8',
                  cursor: blocked ? 'not-allowed' : 'pointer',
                  textDecoration: blocked ? 'line-through' : 'none',
                }}
              >
                {time}
              </button>
            )
          })}
        </div>
      </div>

      {/* КНОПКА ПОДТВЕРЖДЕНИЯ */}
      <div className="px-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedTime || saving}
          className="w-full rounded-2xl py-3.5 text-sm font-medium transition-opacity"
          style={{
            background: selectedTime && !saving ? MASTER.accent : '#F0D8D8',
            color: selectedTime && !saving ? '#fff' : '#b89898',
            cursor: selectedTime && !saving ? 'pointer' : 'not-allowed',
          }}
        >
          {saving
            ? 'Сохраняем...'
            : selectedTime
              ? `Записаться на ${selectedTime}`
              : 'Выберите время'}
        </button>
        {error && (
          <p className="mt-2 text-center text-xs" style={{ color: '#E24B4A' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
