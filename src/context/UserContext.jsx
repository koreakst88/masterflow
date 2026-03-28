import { createContext, useContext, useEffect, useState } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { upsertClient } from '../lib/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const { user, isInTelegram } = useTelegram()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        if (isInTelegram && user?.id) {
          const data = await upsertClient({
            tg_id: user.id,
            name: [user.first_name, user.last_name].filter(Boolean).join(' '),
            username: user.username ?? null,
          })
          setClient(data)
        } else {
          const data = await upsertClient({
            tg_id: 999999999,
            name: 'Евгений',
            username: 'evgeniy_demo',
          })
          setClient(data)
        }
      } catch (e) {
        console.error('Auth error:', e)
        setClient({
          id: null,
          tg_id: 999999999,
          name: 'Евгений',
          username: 'evgeniy_demo',
        })
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  return (
    <UserContext.Provider value={{ client, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
