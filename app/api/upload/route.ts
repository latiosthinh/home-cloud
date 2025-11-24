import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { validatePath, safeJoinPath, getUploadsDir, ensureDir, sanitizeName } from '@/lib/fileUtils'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const currentPath = (formData.get('path') as string) || ''

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate path
        if (currentPath) {
            const pathValidation = validatePath(currentPath)
            if (!pathValidation.isValid) {
                return NextResponse.json({ error: pathValidation.error }, { status: 400 })
            }
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Sanitize filename and add timestamp to prevent collisions
        const timestamp = Date.now()
        const safeName = sanitizeName(file.name)
        const filename = `${timestamp}-${safeName}`

        // Build the full path
        const uploadsDir = getUploadsDir()
        const targetDir = currentPath ? safeJoinPath(uploadsDir, currentPath) : uploadsDir

        // Ensure directory exists
        await ensureDir(targetDir)

        const filepath = path.join(targetDir, filename)

        await writeFile(filepath, buffer)

        return NextResponse.json({
            success: true,
            filename,
            path: currentPath ? `${currentPath}/${filename}` : filename
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
