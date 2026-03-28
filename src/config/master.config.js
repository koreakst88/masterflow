// ЕДИНСТВЕННЫЙ ФАЙЛ ДЛЯ КАСТОМИЗАЦИИ ПОД КЛИЕНТА
export const MASTER = {
  name: 'Master',
  studio: 'Masterflow',
  greeting: 'Записаться к мастеру',
  telegram_id: import.meta.env.VITE_MASTER_TG_ID,
  master_tg_id: Number(import.meta.env.VITE_MASTER_TG_ID),
  accent: '#D4537E',
  bg: '#FDF6F0',
  city: 'Сеул',
  currency: '₸',
  logo_emoji: '💅',
  banner: {
    title: 'Весенняя акция 🌸',
    subtitle: 'Маникюр + гель-лак со скидкой 15%',
    cta: 'Записаться',
  },
  services: [
    { id: 1, name: 'Маникюр + гель', category: 'Маникюр', price: 8000, duration: 60, image: '/images/manicure.jpg' },
    { id: 2, name: 'Педикюр классический', category: 'Педикюр', price: 6000, duration: 45, image: '/images/pedicure.jpg' },
    { id: 3, name: 'Оформление бровей', category: 'Брови', price: 4000, duration: 30, image: '/images/brows.jpg' },
    { id: 4, name: 'Наращивание ресниц', category: 'Ресницы', price: 12000, duration: 90, image: '/images/lashes.jpg' },
  ],
}
