import { FileItem } from '@/lib/fileIconUtils'

interface ShareModalProps {
    isOpen: boolean
    item: FileItem | null
    shareLink: string
    onClose: () => void
    onCopy: () => void
}

export function ShareModal({ isOpen, item, shareLink, onClose, onCopy }: ShareModalProps) {
    if (!isOpen || !item) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Share {item.name}</h2>
                <p>Anyone with this link can view and download this item.</p>
                <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        className="modal-input"
                        value={shareLink}
                        readOnly
                        style={{ marginBottom: 0 }}
                    />
                    <button className="modal-button confirm" onClick={onCopy}>
                        Copy
                    </button>
                </div>
                <div className="modal-actions flex justify-center gap-4 mt-4">
                    <button className="modal-button cancel" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
