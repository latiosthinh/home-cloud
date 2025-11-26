'use client'

import { FolderPlus, Search, SortAsc, SortDesc } from 'lucide-react'

type SortBy = 'name' | 'date'
type SortOrder = 'asc' | 'desc'

interface ToolbarProps {
    searchQuery: string
    sortBy: SortBy
    sortOrder: SortOrder
    onSearchChange: (query: string) => void
    onSortChange: (sortBy: SortBy) => void
    onNewFolder: () => void
}

export function Toolbar({
    searchQuery,
    sortBy,
    sortOrder,
    onSearchChange,
    onSortChange,
    onNewFolder
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <button className="toolbar-button" onClick={onNewFolder}>
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="sort-controls">
                    <button
                        className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                        onClick={() => onSortChange('name')}
                        title="Sort by name"
                    >
                        Name
                        {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                    </button>
                    <button
                        className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
                        onClick={() => onSortChange('date')}
                        title="Sort by date"
                    >
                        Date
                        {sortBy === 'date' && (sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />)}
                    </button>
                </div>
            </div>
        </div>
    )
}
