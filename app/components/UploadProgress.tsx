'use client'

import { useDashboardStore } from '@/lib/store'
import { Loader2 } from 'lucide-react'

export function UploadProgress() {
    const { uploading, uploadProgress, currentUploadFile } = useDashboardStore()

    if (!uploading) return null

    return (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-200">
                        Uploading {currentUploadFile || 'file'}...
                    </span>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {Math.round(uploadProgress)}%
                </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                ></div>
            </div>
        </div>
    )
}
