'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
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
import { UploadProgress } from './components/UploadProgress'
import { DragOverlay } from './components/DragOverlay'

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
    setUploadProgress,
    setCurrentUploadFile,
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
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only set dragging to false if we're leaving the window or the main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const uploadFiles = async (fileList: File[], targetPath: string = currentPath) => {
    setUploading(true)
    for (const file of fileList) {
      setCurrentUploadFile(file.name)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', targetPath)

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', '/api/upload')

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100
              setUploadProgress(progress)
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve()
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }

          xhr.onerror = () => reject(new Error('Upload failed'))

          xhr.send(formData)
        })
      } catch (error) {
        console.error('Upload failed', error)
      }
    }
    setUploading(false)
    setUploadProgress(0)
    setCurrentUploadFile('')
    fetchFiles()
  }

  const handleFolderDrop = async (files: File[], folderPath: string) => {
    await uploadFiles(files, folderPath)
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
    <div
      className="dashboard-container min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="dashboard-header">
        <div className="flex items-center gap-3">
          <Image src="/home-cloud.svg" alt="Home Cloud Logo" width={32} height={32} />
          <h1>Home Cloud</h1>
        </div>
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

      <div className="file-grid mt-8">
        {items.map((item) => (
          <FileCard
            key={item.path}
            item={item}
            onNavigate={navigateToFolder}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={openDeleteModal}
            onDrop={handleFolderDrop}
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

      <UploadProgress />
      <DragOverlay />
    </div>
  )
}
