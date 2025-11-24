'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, File as FileIcon, Image as ImageIcon, Film, FileText, Download, Trash2, LogOut, Folder, FolderPlus, ChevronRight, Home, Search, SortAsc, SortDesc } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FileItem {
  name: string
  path: string
  size: number
  createdAt: string
  modifiedAt: string
  isDirectory: boolean
  type?: string
}

type SortBy = 'name' | 'date'
type SortOrder = 'asc' | 'desc'

export default function Dashboard() {
  const [items, setItems] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null)
  const router = useRouter()

  const fetchFiles = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        path: currentPath,
        sortBy,
        sortOrder,
        search: searchQuery,
      })
      const res = await fetch(`/api/files?${params}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.items)
      } else if (res.status === 401 || res.redirected) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Failed to fetch files', error)
    }
  }, [router, currentPath, sortBy, sortOrder, searchQuery])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files))
    }
  }

  const uploadFiles = async (fileList: File[]) => {
    setUploading(true)
    for (const file of fileList) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', currentPath)

      try {
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
      } catch (error) {
        console.error('Upload failed', error)
      }
    }
    setUploading(false)
    fetchFiles()
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newFolderName, currentPath }),
      })

      if (res.ok) {
        setNewFolderName('')
        setShowNewFolderModal(false)
        fetchFiles()
      }
    } catch (error) {
      console.error('Failed to create folder', error)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemPath: itemToDelete.path }),
      })

      if (res.ok) {
        setShowDeleteModal(false)
        setItemToDelete(null)
        fetchFiles()
      }
    } catch (error) {
      console.error('Failed to delete item', error)
    }
  }

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath)
    setSearchQuery('')
  }

  const getBreadcrumbs = () => {
    if (!currentPath) return []
    const parts = currentPath.split('/')
    const breadcrumbs = []
    let path = ''
    for (const part of parts) {
      path = path ? `${path}/${part}` : part
      breadcrumbs.push({ name: part, path })
    }
    return breadcrumbs
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getIcon = (item: FileItem) => {
    if (item.isDirectory) return <Folder size={24} />
    const type = item.type || ''
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(type)) return <ImageIcon size={24} />
    if (['.mp4', '.webm', '.mov'].includes(type)) return <Film size={24} />
    if (['.txt', '.md', '.json'].includes(type)) return <FileText size={24} />
    return <FileIcon size={24} />
  }

  const isImage = (item: FileItem) => {
    if (item.isDirectory) return false
    const type = item.type || ''
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(type)
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const toggleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Home Cloud</h1>
        <button onClick={handleLogout} className="icon-button" title="Logout">
          <LogOut size={20} />
        </button>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <button
          className="breadcrumb-item"
          onClick={() => navigateToFolder('')}
        >
          <Home size={16} />
          <span>Home</span>
        </button>
        {getBreadcrumbs().map((crumb, index) => (
          <div key={index} className="breadcrumb-wrapper">
            <ChevronRight size={16} className="breadcrumb-separator" />
            <button
              className="breadcrumb-item"
              onClick={() => navigateToFolder(crumb.path)}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button
            className="toolbar-button"
            onClick={() => setShowNewFolderModal(true)}
          >
            <FolderPlus size={18} />
            <span>New Folder</span>
          </button>
        </div>

        <div className="toolbar-right">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sort-controls">
            <button
              className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => toggleSort('name')}
              title="Sort by name"
            >
              Name
              {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
            <button
              className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => toggleSort('date')}
              title="Sort by date"
            >
              Date
              {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`upload-area ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          multiple
          hidden
          onChange={handleFileSelect}
        />
        <div className="upload-content">
          <Upload size={48} style={{ marginBottom: '1rem', color: isDragging ? '#3b82f6' : '#94a3b8' }} />
          <h3>{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            {currentPath ? `Uploading to: ${currentPath}` : 'Support for all file types'}
          </p>
        </div>
      </div>

      <div className="file-grid" style={{ marginTop: '2rem' }}>
        {items.map((item) => (
          <div
            key={item.path}
            className={`file-card ${item.isDirectory ? 'folder-card' : ''}`}
            onClick={() => item.isDirectory && navigateToFolder(item.path)}
            style={{ cursor: item.isDirectory ? 'pointer' : 'default' }}
          >
            <div className="file-preview">
              {isImage(item) ? (
                <img src={`/api/file/${encodeURIComponent(item.path)}`} alt={item.name} loading="lazy" />
              ) : (
                <div style={{ color: item.isDirectory ? '#3b82f6' : '#64748b' }}>
                  {getIcon(item)}
                </div>
              )}
            </div>
            <div className="file-info">
              <div className="file-name" title={item.name}>{item.name}</div>
              <div className="file-size">
                {item.isDirectory ? 'Folder' : formatSize(item.size)}
              </div>
            </div>
            <div className="file-actions" style={{ padding: '0 0.75rem 0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              {!item.isDirectory && (
                <a
                  href={`/api/file/${encodeURIComponent(item.path)}`}
                  download
                  className="action-icon"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={16} />
                </a>
              )}
              <button
                className="action-icon delete-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setItemToDelete(item)
                  setShowDeleteModal(true)
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
          <p>{searchQuery ? 'No items found' : 'No files yet. Upload something!'}</p>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Folder</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setShowNewFolderModal(false)}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={handleCreateFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {itemToDelete.isDirectory ? 'Folder' : 'File'}?</h2>
            <p>
              Are you sure you want to delete <strong>{itemToDelete.name}</strong>?
              {itemToDelete.isDirectory && ' This will delete all contents inside.'}
            </p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-button delete" onClick={handleDeleteItem}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
