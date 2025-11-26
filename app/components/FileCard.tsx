'use client'

import { useState } from 'react'

import { Download, Trash2, Share2 } from 'lucide-react'
import { FileItem, getFileIcon, isImageFile, formatFileSize } from '@/lib/fileIconUtils'

interface FileCardProps {
    item: FileItem
    onNavigate?: (path: string) => void
    onDownload: (item: FileItem) => void
    onShare: (item: FileItem) => void
    onDelete: (item: FileItem) => void
    onDrop?: (files: File[], folderPath: string) => void
}

export function FileCard({ item, onNavigate, onDownload, onShare, onDelete, onDrop }: FileCardProps) {
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        if (!item.isDirectory || !onDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        if (!item.isDirectory || !onDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        if (!item.isDirectory || !onDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            onDrop(files, item.path)
        }
    }

    const handleClick = () => {
        if (item.isDirectory && onNavigate) {
            onNavigate(item.path)
        }
    }

    return (
        <div
            className={`file-card ${item.isDirectory ? 'folder-card' : ''} ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ cursor: item.isDirectory ? 'pointer' : 'default' }}
        >
            <div className="file-preview">
                {isImageFile(item) ? (
                    <img src={`/api/file/${encodeURIComponent(item.path)}`} alt={item.name} loading="lazy" />
                ) : (
                    <div style={{ color: item.isDirectory ? '#3b82f6' : '#64748b' }}>
                        {getFileIcon(item, 24)}
                    </div>
                )}
            </div>
            <div className="file-info">
                <div className="file-name" title={item.name}>{item.name}</div>
                <div className="file-size">
                    {item.isDirectory ? 'Folder' : formatFileSize(item.size)}
                </div>
            </div>
            <div className="file-actions" style={{ padding: '0 0.75rem 0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                    className="action-icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        onShare(item)
                    }}
                    title="Share"
                >
                    <Share2 size={16} />
                </button>
                <button
                    className="action-icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item)
                    }}
                    title="Download"
                >
                    <Download size={16} />
                </button>
                <button
                    className="action-icon delete-icon"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item)
                    }}
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
