import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import { validatePath, safeJoinPath, getUploadsDir, ensureDir, sanitizeName } from '@/lib/fileUtils'

export const maxDuration = 60 // Allow up to 60 seconds for large file uploads

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const currentPath = (formData.get('path') as string) || ''

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`)

        // Validate path
        if (currentPath) {
            const pathValidation = validatePath(currentPath)
            if (!pathValidation.isValid) {
                return NextResponse.json({ error: pathValidation.error }, { status: 400 })
            }
        }

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

        // For large files, use streaming to avoid memory issues
        if (file.size > 10 * 1024 * 1024) { // > 10MB
            console.log('Using streaming for large file')
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            await writeFile(filepath, buffer)
        } else {
            // For smaller files, use the standard approach
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(filepath, buffer)
        }

        console.log(`File uploaded successfully: ${filename}`)

        return NextResponse.json({
            success: true,
            filename,
            path: currentPath ? `${currentPath}/${filename}` : filename
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
