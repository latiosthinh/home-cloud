import { FileItem } from '@/lib/fileIconUtils'

interface DeleteModalProps {
    isOpen: boolean
    item: FileItem | null
    onClose: () => void
    onConfirm: () => void
}

export function DeleteModal({ isOpen, item, onClose, onConfirm }: DeleteModalProps) {
    if (!isOpen || !item) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Delete {item.isDirectory ? 'Folder' : 'File'}?</h2>
                <p>
                    Are you sure you want to delete <strong>{item.name}</strong>?
                    {item.isDirectory && ' This will delete all contents inside.'}
                </p>
                <div className="modal-actions flex justify-center gap-4 mt-4">
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-button delete" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
