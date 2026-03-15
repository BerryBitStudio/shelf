import { useState, useRef } from 'react'
import {
    LuClipboard, LuImage, LuFileText, LuFileCode, LuFileTerminal,
    LuFileArchive, LuFile, LuCheck, LuFileAudio, LuFileVideo,
    LuFileSpreadsheet, LuBraces, LuPresentation,
} from 'react-icons/lu'
import { Transfer } from '../types/types'
import useTransferStore from '../stores/TransferStore'

const EXT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
    // Images
    jpg: LuImage, jpeg: LuImage, png: LuImage, gif: LuImage,
    svg: LuImage, webp: LuImage, ico: LuImage, bmp: LuImage, tiff: LuImage,
    // Documents
    pdf: LuFileText, doc: LuFileText, docx: LuFileText, txt: LuFileText,
    md: LuFileText, rtf: LuFileText, odt: LuFileText, pages: LuFileText,
    // Data / config
    json: LuBraces, toml: LuBraces, yaml: LuBraces, yml: LuBraces,
    xml: LuBraces, ini: LuBraces, env: LuBraces,
    // Spreadsheets
    csv: LuFileSpreadsheet, xls: LuFileSpreadsheet, xlsx: LuFileSpreadsheet,
    ods: LuFileSpreadsheet, tsv: LuFileSpreadsheet,
    // Presentations
    ppt: LuPresentation, pptx: LuPresentation, key: LuPresentation,
    // Code
    js: LuFileCode, jsx: LuFileCode, ts: LuFileCode, tsx: LuFileCode,
    py: LuFileCode, rb: LuFileCode, go: LuFileCode, rs: LuFileCode,
    java: LuFileCode, kt: LuFileCode, swift: LuFileCode, c: LuFileCode,
    cpp: LuFileCode, h: LuFileCode, cs: LuFileCode, php: LuFileCode,
    lua: LuFileCode, r: LuFileCode, scala: LuFileCode, zig: LuFileCode,
    html: LuFileCode, css: LuFileCode, scss: LuFileCode, less: LuFileCode,
    vue: LuFileCode, svelte: LuFileCode, sql: LuFileCode,
    // Shell / terminal
    sh: LuFileTerminal, bash: LuFileTerminal, zsh: LuFileTerminal,
    fish: LuFileTerminal, bat: LuFileTerminal, ps1: LuFileTerminal,
    // Audio
    mp3: LuFileAudio, wav: LuFileAudio, flac: LuFileAudio, aac: LuFileAudio,
    ogg: LuFileAudio, m4a: LuFileAudio, wma: LuFileAudio, aiff: LuFileAudio,
    opus: LuFileAudio, mid: LuFileAudio, midi: LuFileAudio,
    // Video
    mp4: LuFileVideo, mkv: LuFileVideo, avi: LuFileVideo, mov: LuFileVideo,
    wmv: LuFileVideo, flv: LuFileVideo, webm: LuFileVideo, m4v: LuFileVideo,
    // Archives
    zip: LuFileArchive, tar: LuFileArchive, gz: LuFileArchive, '7z': LuFileArchive,
    rar: LuFileArchive, bz2: LuFileArchive, xz: LuFileArchive, zst: LuFileArchive,
    dmg: LuFileArchive, iso: LuFileArchive,
}

const THUMB_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'pdf'])

function getExt(t: Transfer) {
    return t.content.split('.').pop()?.toLowerCase() ?? ''
}

function isImage(t: Transfer) {
    return t.type === 'file' && THUMB_EXTS.has(getExt(t))
}

function getIcon(t: Transfer) {
    if (t.type === 'text') return LuClipboard
    return EXT_ICONS[getExt(t)] ?? LuFile
}

function getLabel(t: Transfer) {
    if (t.type === 'text') return t.content.split('\n')[0]
    return t.content
}

interface TransferItemProps {
    transfer: Transfer
    size?: number
}

export default function TransferItem({ transfer, size = 100 }: TransferItemProps) {
    const { selected, toggleSelect, download } = useTransferStore()
    const [copied, setCopied] = useState(false)
    const isSelected = selected.includes(transfer.id)
    const Icon = getIcon(transfer)
    const iconSize = Math.round(size * 0.4)
    const dim = `${size}px`
    const clickTimer = useRef<number | null>(null)

    function copyText() {
        navigator.clipboard.writeText(transfer.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
    }

    function handleClick() {
        if (transfer.type === 'text') {
            copyText()
            if (selected.includes(transfer.id)) toggleSelect(transfer.id)
            return
        } else {
            // Delay toggle so double-click can cancel it
            clickTimer.current = window.setTimeout(() => {
                toggleSelect(transfer.id)
                clickTimer.current = null
            }, 50)
        }
    }

    function handleDoubleClick() {
        if (transfer.type === 'text') {
            copyText()
        } else {
            if (clickTimer.current != null) {
                clearTimeout(clickTimer.current)
                clickTimer.current = null
            }
            download(transfer.id)
        }
    }

    return (
        <div className={`glow-wrap${isSelected ? ' active' : ''}`} data-transfer-id={transfer.id}
             style={{ borderRadius: '10px' }}
             title={transfer.type === 'file' ? transfer.content : undefined}>
            {isImage(transfer) ? (
                <button
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    className="group relative block overflow-hidden
                                transition-colors cursor-pointer select-none bg-bg"
                    style={{ width: dim, height: dim, borderRadius: '10px' }}
                >
                    <img
                        src={`/api/transfers/${transfer.id}/thumbnail?v=${transfer.created_at}`}
                        alt={transfer.content}
                        loading="lazy"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            maskImage: 'linear-gradient(to top, transparent, black 60%)',
                            WebkitMaskImage: 'linear-gradient(to top, transparent, black 60%)',
                        }}
                    />
                    <LuImage size={14} className="absolute top-2 right-2 text-text opacity-30 group-hover:opacity-70 transition-opacity" />
                    <span className="absolute bottom-0 inset-x-0 text-xs text-text truncate
                                     text-center px-1 py-1">
                        {getLabel(transfer)}
                    </span>
                </button>
            ) : (
                <button
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    className={`group relative flex rounded-lg overflow-hidden
                                transition-colors cursor-pointer select-none bg-surface
                                ${transfer.type === 'text' ? 'items-start' : 'items-center justify-center'}`}
                    style={{ width: dim, height: dim }}
                >
                    {transfer.type === 'text' ? (
                        copied ? (
                            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                                <LuCheck size={iconSize} className="text-accent-light animate-copied" />
                                <span className="text-xs text-accent-light">Copied</span>
                            </span>
                        ) : (
                            <>
                                <span
                                    className="text-xs text-text text-left w-full h-full p-3 overflow-hidden wrap-break-word leading-relaxed"
                                    style={{ maskImage: 'linear-gradient(to bottom, black calc(80% - 1.5rem), transparent 100%)' }}
                                >
                                    {transfer.content}
                                </span>
                                <LuClipboard size={14} className="absolute top-2 right-2 text-text-muted opacity-30 group-hover:opacity-70 transition-opacity" />
                            </>
                        )
                    ) : (
                        <span className="flex flex-col items-center justify-center gap-2 px-2 overflow-hidden">
                            <Icon size={iconSize} className="text-text-muted" />
                            <span className="text-xs text-text text-center w-full line-clamp-2 break-all">
                                {getLabel(transfer)}
                            </span>
                        </span>
                    )}
                </button>
            )}
        </div>
    )
}
