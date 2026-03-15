import { useEffect, useState } from 'react'

interface ConfirmModalProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true))
    }, [])

    function dismiss() {
        setVisible(false)
        setTimeout(onCancel, 150)
    }

    function confirm() {
        setVisible(false)
        setTimeout(onConfirm, 150)
    }

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') { e.preventDefault(); dismiss() }
            else if (e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault()
                const active = document.activeElement
                const confirmBtn = document.getElementById('modal-confirm')
                const cancel = document.getElementById('modal-cancel')
                if (active === confirmBtn) cancel?.focus()
                else confirmBtn?.focus()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onCancel])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-150"
            style={{
                backgroundColor: visible ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)',
            }}
            onClick={dismiss}
        >
            <div
                className="bg-surface border border-border rounded-3xl px-8 py-6 max-w-sm w-full mx-4 transition-all duration-150"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'scale(1)' : 'scale(0.95)',
                }}
                onClick={e => e.stopPropagation()}
            >
                <p className="text-text text-base text-center mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        id="modal-cancel"
                        onClick={dismiss}
                        className="flex-1 px-4 py-2.5 text-sm text-text-muted rounded-2xl bg-bg/50
                                   transition-colors cursor-pointer hover:brightness-125"
                    >
                        Cancel
                    </button>
                    <button
                        id="modal-confirm"
                        onClick={confirm}
                        autoFocus
                        className="flex-1 px-4 py-2.5 text-sm text-bg font-medium bg-red-400/60 rounded-2xl
                                   hover:bg-red-400/80 transition-colors cursor-pointer"
                        style={{ outlineColor: 'rgb(248 113 113 / 0.6)' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
