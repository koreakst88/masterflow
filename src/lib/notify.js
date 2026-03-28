const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN
const MASTER_TG_ID = import.meta.env.VITE_MASTER_TG_ID

export async function notifyMaster({ service, date, time, clientName, total, currency }) {
  if (!BOT_TOKEN || !MASTER_TG_ID || BOT_TOKEN === 'REPLACE_WITH_BOT_TOKEN' || MASTER_TG_ID === 'REPLACE_WITH_MASTER_TG_ID') {
    console.warn('Notify: BOT_TOKEN или MASTER_TG_ID не заданы')
    return
  }

  const dateFormatted = new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const text = [
    '🌸 *Новая запись!*',
    '',
    `👤 Клиент: ${clientName}`,
    `💅 Услуга: ${service.name}`,
    `📅 Дата: ${dateFormatted}`,
    `🕐 Время: ${time}`,
    `⏱ Длительность: ${service.duration} мин`,
    `💰 Стоимость: ${currency}${total.toLocaleString()}`,
  ].join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: MASTER_TG_ID,
        text,
        parse_mode: 'Markdown',
      }),
    })
  } catch (e) {
    console.error('Notify error:', e)
  }
}
