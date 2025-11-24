import { NextResponse } from 'next/server'
import { validatePath, safeJoinPath, getUploadsDir, readDirectoryContents, ensureDir } from '@/lib/fileUtils'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const currentPath = searchParams.get('path') || ''
        const sortBy = searchParams.get('sortBy') || 'date' // 'date' or 'name'
        const sortOrder = searchParams.get('sortOrder') || 'desc' // 'asc' or 'desc'
        const searchQuery = searchParams.get('search') || ''

        // Validate path
        if (currentPath) {
            const pathValidation = validatePath(currentPath)
            if (!pathValidation.isValid) {
                return NextResponse.json({ error: pathValidation.error }, { status: 400 })
            }
        }

        // Build the full path
        const uploadsDir = getUploadsDir()
        await ensureDir(uploadsDir) // Ensure uploads directory exists
        const targetDir = currentPath ? safeJoinPath(uploadsDir, currentPath) : uploadsDir

        // Read directory contents
        let items = await readDirectoryContents(targetDir, currentPath)

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            items = items.filter(item => item.name.toLowerCase().includes(query))
        }

        // Sort items
        items.sort((a, b) => {
            // Always put folders first
            if (a.isDirectory && !b.isDirectory) return -1
            if (!a.isDirectory && b.isDirectory) return 1

            // Then sort by the specified criteria
            let comparison = 0
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name)
            } else {
                // Sort by date (modified date)
                comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime()
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return NextResponse.json({
            items,
            currentPath,
            sortBy,
            sortOrder
        })
    } catch (error) {
        console.error('List files error:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}
