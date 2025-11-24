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
        const filename = name
        const uploadDir = path.join(process.cwd(), 'uploads')
        const filepath = path.join(uploadDir, filename)

        try {
            const fileBuffer = await readFile(filepath)
            const contentType = getMimeType(filename)

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
