import { create } from 'zustand'
import useTransferStore from './TransferStore'

interface AuthStore {
    authed: boolean | null
    checkAuth: () => Promise<void>
    login: () => void
    logout: () => void
}

const useAuthStore = create<AuthStore>(set => ({
    authed: null,

    async checkAuth() {
        try {
            const res = await fetch('/api/auth/check', { credentials: 'include' })
            set({ authed: res.ok })
        } catch {
            set({ authed: false })
        }
    },

    login() {
        set({ authed: true })
    },

    logout() {
        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        useTransferStore.setState({ transfers: [], selected: [], statusText: 'try help', error: null, usage: null })
        set({ authed: false })
    },
}))

export default useAuthStore
