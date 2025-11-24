import { NextResponse } from 'next/server'
import { validatePath, safeJoinPath, getUploadsDir, ensureDir, sanitizeName } from '@/lib/fileUtils'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { folderName, currentPath = '' } = body

        if (!folderName || typeof folderName !== 'string') {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
        }

        // Validate current path
        const pathValidation = validatePath(currentPath)
        if (!pathValidation.isValid) {
            return NextResponse.json({ error: pathValidation.error }, { status: 400 })
        }

        // Sanitize folder name
        const safeFolderName = sanitizeName(folderName)
        if (!safeFolderName || safeFolderName.length === 0) {
            return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 })
        }

        // Build the full path
        const uploadsDir = getUploadsDir()
        const basePath = safeJoinPath(uploadsDir, currentPath)
        const newFolderPath = safeJoinPath(basePath, safeFolderName)

        // Create the folder
        await ensureDir(newFolderPath)

        return NextResponse.json({
            success: true,
            folderName: safeFolderName,
            path: currentPath ? `${currentPath}/${safeFolderName}` : safeFolderName
        })
    } catch (error) {
        console.error('Create folder error:', error)
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
    }
}
