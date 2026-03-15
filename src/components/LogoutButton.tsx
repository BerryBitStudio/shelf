import { LuLogOut } from 'react-icons/lu'
import useAuthStore from '../stores/AuthStore'

export default function LogoutButton() {
    const logout = useAuthStore(s => s.logout)

    function handleLogout() {
        logout()
    }

    return (
        <button
            onClick={handleLogout}
            className="py-1.5 max-sm:pr-0 max-sm:pb-1.5 hover-glow logout-glow transition-all rounded-lg cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5"
            style={{ color: '#b45a5a', outlineColor: 'rgb(248 113 113 / 0.6)' }}
            title="Log out"
        >
            <LuLogOut size={18} style={{ transform: 'scaleX(-1)' }} />
        </button>
    )
}
