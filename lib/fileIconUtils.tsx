import {
    FileIcon,
    ImageIcon,
    Film,
    FileText,
    Folder,
    FileCode,
    FileArchive,
    Music,
    FileSpreadsheet,
    Presentation,
    Palette,
    Package
} from 'lucide-react'

export interface FileItem {
    name: string
    path: string
    size: number
    createdAt: string
    modifiedAt: string
    isDirectory: boolean
    type?: string
}

export function getFileIcon(item: FileItem, size: number = 24) {
    if (item.isDirectory) return <Folder size={size} />
    const type = item.type || ''

    // Images
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'].includes(type))
        return <ImageIcon size={size} />

    // Videos
    if (['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'].includes(type))
        return <Film size={size} />

    // Audio
    if (['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'].includes(type))
        return <Music size={size} />

    // Adobe Creative Suite
    if (['.ai', '.eps'].includes(type))
        return <Palette size={size} className="text-orange-500" />
    if (['.psd', '.psb'].includes(type))
        return <ImageIcon size={size} className="text-blue-500" />
    if (['.pdf'].includes(type))
        return <FileText size={size} className="text-red-500" />

    // Office Documents
    if (['.doc', '.docx', '.odt', '.rtf'].includes(type))
        return <FileText size={size} className="text-blue-600" />
    if (['.xls', '.xlsx', '.csv', '.ods'].includes(type))
        return <FileSpreadsheet size={size} className="text-green-600" />
    if (['.ppt', '.pptx', '.odp'].includes(type))
        return <Presentation size={size} className="text-orange-600" />

    // Code files
    if (['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt'].includes(type))
        return <FileCode size={size} className="text-purple-500" />
    if (['.html', '.css', '.scss', '.sass', '.less'].includes(type))
        return <FileCode size={size} className="text-pink-500" />
    if (['.json', '.xml', '.yaml', '.yml', '.toml'].includes(type))
        return <FileCode size={size} className="text-yellow-600" />

    // Archives
    if (['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'].includes(type))
        return <FileArchive size={size} className="text-amber-600" />

    // Text/Markdown
    if (['.txt', '.md', '.markdown', '.log'].includes(type))
        return <FileText size={size} />

    // 3D/CAD
    if (['.obj', '.fbx', '.stl', '.blend', '.3ds', '.dwg', '.dxf'].includes(type))
        return <Package size={size} className="text-teal-500" />

    // Default
    return <FileIcon size={size} />
}

export function isImageFile(item: FileItem): boolean {
    if (item.isDirectory) return false
    const type = item.type || ''
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(type)
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export interface Breadcrumb {
    name: string
    path: string
}

export function getBreadcrumbs(currentPath: string): Breadcrumb[] {
    if (!currentPath) return []
    const parts = currentPath.split('/')
    const breadcrumbs: Breadcrumb[] = []
    let path = ''
    for (const part of parts) {
        path = path ? `${path}/${part}` : part
        breadcrumbs.push({ name: part, path })
    }
    return breadcrumbs
}
