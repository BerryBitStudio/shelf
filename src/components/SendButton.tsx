import { useState, useEffect } from 'react'
import { LuSendHorizontal } from 'react-icons/lu'
import useTransferStore from '../stores/TransferStore'

export default function SendButton() {
    const { activity, createText } = useTransferStore()
    const [hasText, setHasText] = useState(false)
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        const input = document.getElementById('text-input') as HTMLInputElement | null
        if (!input) return
        function check() { setHasText(!!input!.value.trim()) }
        function onFocus() { setFocused(true) }
        function onBlur() { setFocused(false) }
        input.addEventListener('input', check)
        input.addEventListener('focus', onFocus)
        input.addEventListener('blur', onBlur)
        check()
        setFocused(document.activeElement === input)
        return () => {
            input.removeEventListener('input', check)
            input.removeEventListener('focus', onFocus)
            input.removeEventListener('blur', onBlur)
        }
    }, [])

    const disabled = !hasText || !focused || !!activity

    function handleSend() {
        const input = document.getElementById('text-input') as HTMLInputElement | null
        if (!input || !input.value.trim()) return
        const text = input.value.trim()
        createText(text).then(dupId => {
            if (dupId) {
                const el = document.querySelector(`[data-transfer-id="${dupId}"]`)
                if (el) {
                    el.classList.remove('animate-nudge')
                    void (el as HTMLElement).offsetWidth
                    el.classList.add('animate-nudge')
                    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
                }
            }
        })
        // Clear the input via native setter to trigger React's onChange
        const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
        nativeSetter.call(input, '')
        input.dispatchEvent(new Event('input', { bubbles: true }))
    }

    return (
        <button
            onMouseDown={e => { e.preventDefault(); handleSend() }}
            disabled={disabled}
            className="text-bg bg-accent hover:bg-accent-light disabled:opacity-40 transition-all rounded-full cursor-pointer px-2 py-2 mr-0.5"
            title="Send text"
        >
            <LuSendHorizontal size={14} />
        </button>
    )
}
