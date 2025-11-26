'use client'

import { Upload } from 'lucide-react'
import { useDashboardStore } from '@/lib/store'

export function DragOverlay() {
    const { isDragging } = useDashboardStore()

    if (!isDragging) return null

    return (
        <div className="fixed inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-blue-500 border-dashed flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                    <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Drop files to upload
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Release your mouse to start uploading
                </p>
            </div>
        </div>
    )
}
