export function useTelegram() {
  const tg = window.Telegram?.WebApp

  function ready() {
    tg?.ready()
    tg?.expand()
  }

  const user = tg?.initDataUnsafe?.user

  return {
    tg,
    user,
    ready,
    isInTelegram: !!tg,
  }
}
