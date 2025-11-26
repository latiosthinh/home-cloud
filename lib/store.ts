import { create } from 'zustand'
import { FileItem } from './fileIconUtils'

type SortBy = 'name' | 'date'
type SortOrder = 'asc' | 'desc'

interface DashboardState {
    // File state
    items: FileItem[]
    currentPath: string
    searchQuery: string
    sortBy: SortBy
    sortOrder: SortOrder

    // Upload state
    isDragging: boolean
    uploading: boolean

    // Modal state
    showNewFolderModal: boolean
    newFolderName: string
    showDeleteModal: boolean
    itemToDelete: FileItem | null
    showShareModal: boolean
    shareLink: string
    itemToShare: FileItem | null

    // Actions
    setItems: (items: FileItem[]) => void
    setCurrentPath: (path: string) => void
    setSearchQuery: (query: string) => void
    setSortBy: (sortBy: SortBy) => void
    setSortOrder: (order: SortOrder) => void
    toggleSort: (sortBy: SortBy) => void

    setIsDragging: (isDragging: boolean) => void
    setUploading: (uploading: boolean) => void

    openNewFolderModal: () => void
    closeNewFolderModal: () => void
    setNewFolderName: (name: string) => void

    openDeleteModal: (item: FileItem) => void
    closeDeleteModal: () => void

    openShareModal: (item: FileItem, link: string) => void
    closeShareModal: () => void

    navigateToFolder: (path: string) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    // Initial state
    items: [],
    currentPath: '',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc',

    isDragging: false,
    uploading: false,

    showNewFolderModal: false,
    newFolderName: '',
    showDeleteModal: false,
    itemToDelete: null,
    showShareModal: false,
    shareLink: '',
    itemToShare: null,

    // Actions
    setItems: (items) => set({ items }),
    setCurrentPath: (path) => set({ currentPath: path }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (order) => set({ sortOrder: order }),

    toggleSort: (newSortBy) => {
        const { sortBy, sortOrder } = get()
        if (sortBy === newSortBy) {
            set({ sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })
        } else {
            set({ sortBy: newSortBy, sortOrder: 'asc' })
        }
    },

    setIsDragging: (isDragging) => set({ isDragging }),
    setUploading: (uploading) => set({ uploading }),

    openNewFolderModal: () => set({ showNewFolderModal: true }),
    closeNewFolderModal: () => set({ showNewFolderModal: false, newFolderName: '' }),
    setNewFolderName: (name) => set({ newFolderName: name }),

    openDeleteModal: (item) => set({ showDeleteModal: true, itemToDelete: item }),
    closeDeleteModal: () => set({ showDeleteModal: false, itemToDelete: null }),

    openShareModal: (item, link) => set({ showShareModal: true, itemToShare: item, shareLink: link }),
    closeShareModal: () => set({ showShareModal: false, itemToShare: null, shareLink: '' }),

    navigateToFolder: (path) => set({ currentPath: path, searchQuery: '' }),
}))
