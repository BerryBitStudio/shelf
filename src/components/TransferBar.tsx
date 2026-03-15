import { useEffect, useRef } from 'react'
import TextInput from './TextInput'
import InfoButton from './InfoButton'
import PasteButton from './PasteButton'
import UploadButton from './UploadButton'
import DownloadButton from './DownloadButton'
import DeleteButton from './DeleteButton'
import useTransferStore from '../stores/TransferStore'
import logoUrl from '../assets/melogo.svg'

const LOGO_MASK = `url("${logoUrl}")`

const SPEED_MAX = 240    // deg/s at full speed
const RAMP_UP = 0.4      // seconds to reach full speed
const RAMP_DOWN = 0.8    // seconds to coast to stop

function MeLogo({ className, fill, glow }: { className?: string; fill: string; glow?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)
    const state = useRef({ angle: 0, t: 0, last: 0 })

    useEffect(() => {
        const s = state.current
        s.last = 0
        let raf: number
        function tick(now: number) {
            const dt = s.last ? (now - s.last) / 1000 : 0
            s.last = now

            if (glow) {
                s.t = Math.min(s.t + dt / RAMP_UP, 1)
            } else {
                s.t = Math.max(s.t - dt / RAMP_DOWN, 0)
            }

            const speed = SPEED_MAX * Math.sin(s.t * Math.PI / 2)
            s.angle = (s.angle + speed * dt) % 360
            if (ref.current) {
                ref.current.style.transform = `rotate(${s.angle}deg)`
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [glow])

    return (
        <div
            ref={ref}
            className={`${glow ? 'logo-glow' : ''} ${className ?? ''}`}
            style={{
                maskImage: LOGO_MASK,
                WebkitMaskImage: LOGO_MASK,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                backgroundColor: glow ? undefined : fill,
                transition: 'background-color 0.3s ease',
            }}
        />
    )
}

export default function TransferBar({ onHelp }: { onHelp: () => void }) {
    const { fetch, activity, statusText, selected } = useTransferStore()
    const loading = !!activity

    const statusLabel = activity || (selected.length > 0 ? `${selected.length} selected` : statusText)

    return (
        <>
            {/* Desktop */}
            <div className="hidden sm:inline-flex items-center gap-3 select-none ml-16">
                <div className="inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-full
                                bg-surface border border-border/30"
                     style={{ boxShadow: '0 0 20px 8px rgba(0, 0, 0, 0.2)' }}>
                    <TextInput />
                    <UploadButton />
                    <DownloadButton />
                    <InfoButton onClick={onHelp} />
                </div>
                <div className="inline-flex items-center gap-1">
                    <button
                        onClick={() => fetch()}
                        className={`cursor-pointer transition-all rounded-full hover-glow hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${loading ? 'opacity-90' : 'opacity-60 hover:opacity-90'}`}
                        title="Refresh"
                    >
                        <MeLogo
                            className="h-8 w-8"
                            fill="var(--color-accent)"
                            glow={loading}
                        />
                    </button>
                    <span className={`text-xs text-accent whitespace-nowrap min-w-16 ${loading ? 'opacity-90' : 'opacity-60'}`}>
                        {statusLabel}
                    </span>
                </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col items-center gap-3 select-none">
                <div className="inline-flex items-center gap-1">
                    <button
                        onClick={() => fetch()}
                        className={`cursor-pointer transition-all rounded-full hover-glow ${loading ? 'opacity-90' : 'opacity-60 hover:opacity-90'}`}
                        title="Refresh"
                    >
                        <MeLogo
                            className="h-10 w-10"
                            fill="var(--color-accent)"
                            glow={loading}
                        />
                    </button>
                    <span className={`text-xs text-accent whitespace-nowrap ${loading ? 'opacity-90' : 'opacity-60'}`}>
                        {statusLabel}
                    </span>
                </div>
                <div className="inline-flex items-center gap-2 px-1 py-1 rounded-full
                                bg-surface border border-border/30"
                     style={{ boxShadow: '0 0 20px 8px rgba(0, 0, 0, 0.2)' }}>
                    <PasteButton />
                    <UploadButton />
                    <DownloadButton />
                    <DeleteButton />
                    <InfoButton onClick={onHelp} />
                </div>
            </div>
        </>
    )
}
