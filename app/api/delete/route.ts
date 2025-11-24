import { NextResponse } from 'next/server'
import { validatePath, safeJoinPath, getUploadsDir, deleteRecursive, countItemsRecursive } from '@/lib/fileUtils'
import { stat } from 'fs/promises'

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { itemPath } = body

        if (!itemPath || typeof itemPath !== 'string') {
            return NextResponse.json({ error: 'Item path is required' }, { status: 400 })
        }

        // Validate path
        const pathValidation = validatePath(itemPath)
        if (!pathValidation.isValid) {
            return NextResponse.json({ error: pathValidation.error }, { status: 400 })
        }

        // Build the full path
        const uploadsDir = getUploadsDir()
        const fullPath = safeJoinPath(uploadsDir, itemPath)

        // Check if item exists
        try {
            const stats = await stat(fullPath)
            const isDirectory = stats.isDirectory()

            // If it's a directory, count items for confirmation
            let itemCount = 0
            if (isDirectory) {
                itemCount = await countItemsRecursive(fullPath)
            }

            // Delete the item
            await deleteRecursive(fullPath)

            return NextResponse.json({
                success: true,
                isDirectory,
                itemCount
            })
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return NextResponse.json({ error: 'Item not found' }, { status: 404 })
            }
            throw error
        }
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}
