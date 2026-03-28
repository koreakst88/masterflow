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
      const tg_id = isInTelegram && user?.id ? user.id : 999999999
      const name = isInTelegram && user?.first_name
        ? [user.first_name, user.last_name].filter(Boolean).join(' ')
        : 'Евгений'
      const username = isInTelegram && user?.username
        ? user.username
        : 'demo'

      console.log('Auth init:', { tg_id, name, username, isInTelegram })

      try {
        const data = await upsertClient({ tg_id, name, username })
        console.log('Client set:', data)
        setClient(data)
      } catch (e) {
        console.error('upsertClient failed:', e)
        setClient({
          id: -1,
          tg_id: 999999999,
          name: 'Евгений',
          username: 'demo',
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
