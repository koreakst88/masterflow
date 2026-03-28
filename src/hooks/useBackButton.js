import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ROOT_ROUTES = ['/']

export function useBackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const tg = window.Telegram?.WebApp

  useEffect(() => {
    if (!tg) return undefined

    const isRoot = ROOT_ROUTES.includes(location.pathname)

    if (isRoot) {
      tg.BackButton.hide()
      return undefined
    }

    tg.BackButton.show()
    const handleBack = () => navigate(-1)
    tg.BackButton.onClick(handleBack)

    return () => {
      tg.BackButton.offClick(handleBack)
    }
  }, [location.pathname, navigate, tg])
}
