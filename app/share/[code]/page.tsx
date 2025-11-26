'use client'

import { useState, useEffect } from 'react'
import { Download, File as FileIcon, Folder, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'

interface ShareData {
    share: {
        id: string
        path: string
        createdAt: string
        views: number
    }
    item: {
        name: string
        size: number
        isDirectory: boolean
        type?: string
    }
    children?: any[]
}

export default function SharePage() {
    const params = useParams()
    const [data, setData] = useState<ShareData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchShare = async () => {
            try {
                const res = await fetch(`/api/share/${params.code}`)
                if (res.ok) {
                    const shareData = await res.json()
                    setData(shareData)
                } else {
                    setError('Share not found or expired')
                }
            } catch (err) {
                setError('Failed to load share')
            } finally {
                setLoading(false)
            }
        }

        if (params.code) {
            fetchShare()
        }
    }, [params.code])

    const handleDownload = async () => {
        if (!data) return
        try {
            const res = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemPath: data.share.path }),
            })

            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = data.item.name + (data.item.isDirectory ? '.zip' : '')
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            }
        } catch (error) {
            console.error('Download failed', error)
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-slate-400">{error || 'This link is invalid or has expired.'}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-slate-700">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700 mb-4 text-blue-400">
                        {data.item.isDirectory ? <Folder size={40} /> : <FileIcon size={40} />}
                    </div>
                    <h1 className="text-2xl font-bold mb-2 break-all">{data.item.name}</h1>
                    <p className="text-slate-400">
                        {data.item.isDirectory ? 'Folder' : formatSize(data.item.size)} • {new Date(data.share.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    Download {data.item.isDirectory ? 'ZIP' : 'File'}
                </button>

                {data.item.isDirectory && data.children && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Contents</h3>
                        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 max-h-60 overflow-y-auto">
                            {data.children.map((child: any, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                                    {child.isDirectory ? <Folder size={16} className="text-blue-400" /> : <FileIcon size={16} className="text-slate-400" />}
                                    <span className="text-sm truncate flex-1">{child.name}</span>
                                    <span className="text-xs text-slate-500">{child.isDirectory ? '-' : formatSize(child.size)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
