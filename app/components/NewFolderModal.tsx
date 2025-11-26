interface NewFolderModalProps {
    isOpen: boolean
    folderName: string
    onClose: () => void
    onFolderNameChange: (name: string) => void
    onCreate: () => void
}

export function NewFolderModal({
    isOpen,
    folderName,
    onClose,
    onFolderNameChange,
    onCreate
}: NewFolderModalProps) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Folder</h2>
                <input
                    type="text"
                    className="modal-input"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => onFolderNameChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onCreate()}
                    autoFocus
                />
                <div className="modal-actions flex justify-center gap-4 mt-4">
                    <button className="modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-button confirm" onClick={onCreate}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}
