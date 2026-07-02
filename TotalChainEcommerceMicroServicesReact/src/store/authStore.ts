import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IUserSession } from '../interfaces/login.interface'

interface AuthState {
  user: IUserSession | null
  token: string | null
  isAuthenticated: boolean
  login: (user: IUserSession, token: string) => void
  logout: () => void
  restoreFromCookie: () => boolean
  setHydrated: () => void
}

function decodeToken(token: string): { email: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.email && payload.role) {
      return { email: payload.email, role: payload.role }
    }
  } catch { /* ignore */ }
  return null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
      restoreFromCookie: () => {
        const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
        if (!match) return false
        const token = decodeURIComponent(match[1])
        const userData = decodeToken(token)
        if (!userData) return false
        const user: IUserSession = { email: userData.email, token, role: userData.role }
        set({ user, token, isAuthenticated: true })
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({ email: userData.email, role: userData.role }))
        return true
      },
      setHydrated: () => set({ isAuthenticated: get().token !== null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)