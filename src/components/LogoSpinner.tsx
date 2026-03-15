import { useEffect, useRef } from 'react'
import logoUrl from '../assets/shelf-logo.svg'

const LOGO_MASK = `url("${logoUrl}")`

const SPEED_MAX = 240    // deg/s at full speed
const RAMP_UP = 0.4      // seconds to reach full speed
const RAMP_DOWN = 0.8    // seconds to coast to stop

interface LogoSpinnerProps {
    className?: string
    fill: string
    spinning?: boolean
}

export default function LogoSpinner({ className, fill, spinning }: LogoSpinnerProps) {
    const ref = useRef<HTMLDivElement>(null)
    const state = useRef({ angle: 0, t: 0, last: 0 })

    useEffect(() => {
        const s = state.current
        s.last = 0
        let raf: number
        function tick(now: number) {
            const dt = s.last ? (now - s.last) / 1000 : 0
            s.last = now

            if (spinning) {
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
    }, [spinning])

    return (
        <div
            ref={ref}
            className={`${spinning ? 'logo-glow' : ''} ${className ?? ''}`}
            style={{
                maskImage: LOGO_MASK,
                WebkitMaskImage: LOGO_MASK,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                backgroundColor: spinning ? undefined : fill,
                transition: 'background-color 0.3s ease',
            }}
        />
    )
}
