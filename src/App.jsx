import { useEffect, useState } from 'react'
import useAuthStore from './stores/AuthStore'
import AccessPage from './pages/AccessPage'
import TransferPage from './pages/TransferPage'
import HelpPage from './pages/HelpPage'
import PasswordPage from './pages/PasswordPage'

export default function App() {
    const { authed, checkAuth, login } = useAuthStore()
    const [page, setPage] = useState('transfer')

    useEffect(() => { checkAuth() }, [checkAuth])

    if (authed === null) return null

    if (!authed) return <AccessPage onLogin={login} />

    if (page === 'help') return <HelpPage onBack={() => setPage('transfer')} onPassword={() => setPage('password')} />

    if (page === 'password') return <PasswordPage onBack={() => setPage('help')} onHome={() => setPage('transfer')} />

    return <TransferPage onHelp={() => setPage('help')} />
}
