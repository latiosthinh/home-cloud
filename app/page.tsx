'use client'

import { useEffect, useCallback } from 'react'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FileItem, getBreadcrumbs } from '@/lib/fileIconUtils'
import { useDashboardStore } from '@/lib/store'
import { UploadArea } from './components/UploadArea'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { Toolbar } from './components/Toolbar'
import { FileCard } from './components/FileCard'
import { NewFolderModal } from './components/NewFolderModal'
import { DeleteModal } from './components/DeleteModal'
import { ShareModal } from './components/ShareModal'

export default function Dashboard() {
  const router = useRouter()

  // Get state and actions from Zustand store
  const {
    items,
    currentPath,
    searchQuery,
    sortBy,
    sortOrder,
    isDragging,
    uploading,
    showNewFolderModal,
    newFolderName,
    showDeleteModal,
    itemToDelete,
    showShareModal,
    shareLink,
    itemToShare,
    setItems,
    setSearchQuery,
    toggleSort,
    setIsDragging,
    setUploading,
    openNewFolderModal,
    closeNewFolderModal,
    setNewFolderName,
    openDeleteModal,
    closeDeleteModal,
    openShareModal,
    closeShareModal,
    navigateToFolder,
  } = useDashboardStore()

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
  }, [router, currentPath, sortBy, sortOrder, searchQuery, setItems])

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
        closeNewFolderModal()
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
        closeDeleteModal()
        fetchFiles()
      }
    } catch (error) {
      console.error('Failed to delete item', error)
    }
  }

  const handleDownload = async (item: FileItem) => {
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemPath: item.path }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = item.name + (item.isDirectory ? '.zip' : '')
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed', error)
    }
  }

  const handleShare = async (item: FileItem) => {
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemPath: item.path }),
      })

      if (res.ok) {
        const share = await res.json()
        const link = `${window.location.origin}/share/${share.id}`
        openShareModal(item, link)
      }
    } catch (error) {
      console.error('Share failed', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    alert('Link copied to clipboard!')
  }

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Home Cloud</h1>
        <button onClick={handleLogout} className="icon-button" title="Logout">
          <LogOut size={20} />
        </button>
      </header>

      <BreadcrumbNav
        breadcrumbs={getBreadcrumbs(currentPath)}
        onNavigate={navigateToFolder}
      />

      <Toolbar
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onSortChange={toggleSort}
        onNewFolder={openNewFolderModal}
      />

      <UploadArea
        isDragging={isDragging}
        uploading={uploading}
        currentPath={currentPath}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFileSelect}
      />

      <div className="file-grid" style={{ marginTop: '2rem' }}>
        {items.map((item) => (
          <FileCard
            key={item.path}
            item={item}
            onNavigate={navigateToFolder}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={openDeleteModal}
          />
        ))}
      </div>

      {items.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
          <p>{searchQuery ? 'No items found' : 'No files yet. Upload something!'}</p>
        </div>
      )}

      <NewFolderModal
        isOpen={showNewFolderModal}
        folderName={newFolderName}
        onClose={closeNewFolderModal}
        onFolderNameChange={setNewFolderName}
        onCreate={handleCreateFolder}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        item={itemToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteItem}
      />

      <ShareModal
        isOpen={showShareModal}
        item={itemToShare}
        shareLink={shareLink}
        onClose={closeShareModal}
        onCopy={copyToClipboard}
      />
    </div>
  )
}
