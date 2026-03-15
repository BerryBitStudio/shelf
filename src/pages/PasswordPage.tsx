import { useState, useRef, useEffect } from 'react'
import { LuArrowLeft, LuCheck } from 'react-icons/lu'

const CARET_COLORS = [
    'var(--color-accent)',
    'var(--color-accent-light)',
    'var(--color-accent-dark)',
    'var(--color-highlight)',
    'var(--color-accent-light)',
    'var(--color-accent)',
]

export default function PasswordPage({ onBack, onHome }: { onBack: () => void, onHome: () => void }) {
    const [current, setCurrent] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)
    const [loading, setLoading] = useState(false)
    const caretIdx = useRef(0)
    const [caretColor, setCaretColor] = useState(CARET_COLORS[0])

    function advanceCaret() {
        caretIdx.current = (caretIdx.current + 1) % CARET_COLORS.length
        setCaretColor(CARET_COLORS[caretIdx.current])
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (newPass !== confirm) {
            setError("New passwords don't match")
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    current_password: current,
                    new_password: newPass,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                if (res.status === 409) {
                    setError('Password is already in use')
                } else if (res.status === 400) {
                    setError('Current password is incorrect')
                } else {
                    setError(data?.detail ?? 'Something went wrong')
                }
                return
            }

            setDone(true)
        } catch {
            setError('Connection failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                e.preventDefault()
                done ? onHome() : onBack()
            }
            if (done && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onHome()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onBack, onHome, done])

    const inputClass = `peer w-full bg-transparent rounded-none
        mx-0.25 px-2.75 my-0.25 py-1.5 text-xs text-text placeholder:text-text/60
        hover:placeholder:text-accent focus:placeholder:text-accent
        placeholder:transition-colors`

    if (done) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
                <h1 className="text-2xl font-medium text-text">Change password</h1>
                <div className="flex flex-col items-center gap-3">
                    <LuCheck size={32} className="text-accent" />
                    <p className="text-sm text-text">Password changed</p>
                </div>
                <button
                    onClick={onHome}
                    autoFocus
                    className="text-xs text-bg bg-accent rounded-full px-4 py-1.5
                               hover:bg-accent-light transition-colors cursor-pointer"
                >
                    Continue
                </button>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
            <h1 className="text-2xl font-medium text-text">Change password</h1>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-48">
                {[
                    { id: 'current', label: 'Current password', value: current, set: setCurrent, autoFocus: true },
                    { id: 'new', label: 'New password', value: newPass, set: setNewPass },
                    { id: 'confirm', label: 'Confirm new password', value: confirm, set: setConfirm },
                ].map(({ id, label, value, set, autoFocus }) => (
                    <div key={id} className="inline-flex items-center gap-2 px-1 py-1 rounded-full w-full
                                    bg-surface border border-border/30"
                         style={{ boxShadow: '0 0 20px 8px rgba(0, 0, 0, 0.2)' }}>
                        <div className="relative flex-1">
                            <label htmlFor={id} className="sr-only">{label}</label>
                            <input
                                id={id}
                                type="password"
                                value={value}
                                onChange={e => { set(e.target.value); advanceCaret() }}
                                placeholder={label}
                                autoComplete="off"
                                data-1p-ignore
                                data-lpignore="true"
                                data-bwignore
                                autoFocus={autoFocus}
                                className={inputClass}
                                style={{ caretColor }}
                            />
                            <div className="absolute bottom-1 left-3 right-3 h-px bg-border/30 pointer-events-none transition-colors peer-focus:bg-accent/50" />
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading || !current || !newPass || !confirm}
                    className="text-xs text-bg bg-accent rounded-full px-4 py-1.5 mt-1
                               hover:bg-accent-light disabled:opacity-40 transition-colors
                               cursor-pointer whitespace-nowrap"
                >
                    {loading ? 'Changing...' : 'Change password'}
                </button>

                {error && <p className="text-xs text-red-400/80">{error}</p>}
            </form>

            <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs text-text-muted/50 hover:text-accent transition-colors cursor-pointer"
            >
                <LuArrowLeft size={14} aria-hidden="true" />
                Back
            </button>
        </main>
    )
}
