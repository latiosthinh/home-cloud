'use client'

import { Upload } from 'lucide-react'

interface UploadAreaProps {
    isDragging: boolean
    uploading: boolean
    currentPath: string
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadArea({
    isDragging,
    uploading,
    currentPath,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect
}: UploadAreaProps) {
    return (
        <div
            className={`upload-area ${isDragging ? 'active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input')?.click()}
        >
            <input
                type="file"
                id="file-input"
                multiple
                hidden
                onChange={onFileSelect}
            />
            <div className="upload-content">
                <Upload size={48} style={{ marginBottom: '1rem', color: isDragging ? '#3b82f6' : '#94a3b8' }} />
                <h3>{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</h3>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                    {currentPath ? `Uploading to: ${currentPath}` : 'Support for all file types'}
                </p>
            </div>
        </div>
    )
}
