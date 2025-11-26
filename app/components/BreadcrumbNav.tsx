'use client'

import { Home, ChevronRight } from 'lucide-react'
import { Breadcrumb } from '@/lib/fileIconUtils'

interface BreadcrumbNavProps {
    breadcrumbs: Breadcrumb[]
    onNavigate: (path: string) => void
}

export function BreadcrumbNav({ breadcrumbs, onNavigate }: BreadcrumbNavProps) {
    return (
        <div className="breadcrumb-container">
            <button
                className="breadcrumb-item"
                onClick={() => onNavigate('')}
            >
                <Home size={16} />
                <span>Home</span>
            </button>
            {breadcrumbs.map((crumb, index) => (
                <div key={index} className="breadcrumb-wrapper">
                    <ChevronRight size={16} className="breadcrumb-separator" />
                    <button
                        className="breadcrumb-item"
                        onClick={() => onNavigate(crumb.path)}
                    >
                        {crumb.name}
                    </button>
                </div>
            ))}
        </div>
    )
}
