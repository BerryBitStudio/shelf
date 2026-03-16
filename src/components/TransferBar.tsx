import TextInput from './TextInput'
import SendButton from './SendButton'
import PasteButton from './PasteButton'
import UploadButton from './UploadButton'
import DownloadButton from './DownloadButton'
import DeleteButton from './DeleteButton'
import LogoutButton from './LogoutButton'
import LogoSpinner from './LogoSpinner'
import InfoButton from './InfoButton'
import useTransferStore from '../stores/TransferStore'

export default function TransferBar({ onHelp }: { onHelp: () => void }) {
    const { fetch, activity, statusText, selected, error } = useTransferStore()
    const loading = !!activity

    const statusLabel = activity || (selected.length > 0 ? `${selected.length} selected` : statusText)

    return (
        <>
            {/* Desktop */}
            <div className="hidden sm:inline-flex items-center gap-3 select-none">
                <LogoutButton />
                <InfoButton onClick={onHelp} />
                <div className="relative inline-flex items-center gap-2 px-1 py-1 rounded-full
                                bg-surface border border-border/30"
                     style={{ boxShadow: '0 0 20px 8px rgba(0, 0, 0, 0.2)' }}>
                    {error && (
                        <p className="absolute -top-6 left-3 text-red-400/80 text-xs whitespace-nowrap">{error}</p>
                    )}
                    <TextInput />
                    <SendButton />
                    <UploadButton />
                    <DownloadButton />
                    <DeleteButton />
                </div>
                <div className="inline-flex items-center gap-3">
                    <button
                        onClick={() => fetch()}
                        className={`cursor-pointer transition-all rounded-full hover-glow hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${loading ? 'opacity-90' : 'opacity-60 hover:opacity-90'}`}
                        title="Refresh"
                    >
                        <LogoSpinner
                            className="h-7.5 w-7.5"
                            fill="var(--color-accent)"
                            spinning={loading}
                        />
                    </button>
                    <span className={`text-xs text-accent whitespace-nowrap min-w-16 ${loading ? 'opacity-100' : 'opacity-70'}`}>
                        {statusLabel}
                    </span>
                </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden flex flex-col items-center gap-2 select-none">
                {error && (
                    <p className="text-red-400/80 text-xs">{error}</p>
                )}
                <span className={`text-xs text-accent whitespace-nowrap ${loading ? 'opacity-100' : 'opacity-70'}`}>
                    {statusLabel}
                </span>
                <button
                    onClick={() => fetch()}
                    className={`cursor-pointer transition-all rounded-full hover-glow mb-2 ${loading ? 'opacity-90' : 'opacity-60 hover:opacity-90'}`}
                    title="Refresh"
                >
                    <LogoSpinner
                        className="h-12 w-12"
                        fill="var(--color-accent)"
                        spinning={loading}
                    />
                </button>
                <div className="inline-flex items-center gap-2 px-1 py-1 rounded-full
                                bg-surface border border-border/30"
                     style={{ boxShadow: '0 0 20px 8px rgba(0, 0, 0, 0.2)' }}>
                    <LogoutButton />
                    <InfoButton onClick={onHelp} />
                    <PasteButton />
                    <UploadButton />
                    <DownloadButton />
                    <DeleteButton />
                </div>
            </div>
        </>
    )
}
