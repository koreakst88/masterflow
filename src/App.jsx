import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import BookingPage from './pages/BookingPage'
import MasterPage from './pages/MasterPage'
import MyBookings from './pages/MyBookings'
import ProfilePage from './pages/ProfilePage'
import BottomNav from './components/BottomNav'
import { MASTER } from './config/master.config'
import { useUser } from './context/UserContext'
import { useBackButton } from './hooks/useBackButton'
import { useTelegram } from './hooks/useTelegram'

function AppInner() {
  const { ready } = useTelegram()
  const { loading } = useUser()
  useBackButton()

  useEffect(() => {
    ready()
  }, [])

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: MASTER.bg }}
      >
        <div className="text-4xl animate-bounce">{MASTER.logo_emoji}</div>
        <p className="text-sm" style={{ color: MASTER.accent }}>
          {MASTER.studio}
        </p>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/master" element={<MasterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return <AppInner />
}
