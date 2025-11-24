import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// Simple mime type map if I don't want to install a package
const getMimeType = (filename: string) => {
    const ext = path.extname(filename).toLowerCase()
    const types: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.mp4': 'video/mp4',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
    }
    return types[ext] || 'application/octet-stream'
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ name: string }> }
) {
    try {
        const { name } = await params

        // The name parameter can contain path separators for nested files
        // Decode the URL-encoded path
        const decodedPath = decodeURIComponent(name)

        // Basic validation to prevent directory traversal
        if (decodedPath.includes('..') || decodedPath.includes('\0')) {
            return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'uploads')
        const filepath = path.join(uploadDir, decodedPath)

        try {
            const fileBuffer = await readFile(filepath)
            const contentType = getMimeType(decodedPath)

            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            })
        } catch (err) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
