import { NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { createReadStream } from 'fs'
import path from 'path'
import archiver from 'archiver'
import { Readable } from 'stream'

export async function POST(request: Request) {
    try {
        const { itemPath } = await request.json()

        if (!itemPath) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 })
        }

        // Basic validation
        if (itemPath.includes('..') || itemPath.includes('\0')) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
        }

        const uploadDir = path.join(process.cwd(), 'uploads')
        const fullPath = path.join(uploadDir, itemPath)

        try {
            const stats = await stat(fullPath)
            const itemName = path.basename(itemPath)

            if (stats.isDirectory()) {
                // Create ZIP stream
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level.
                })

                // Pipe archive data to a PassThrough stream which we can then convert to a Web ReadableStream
                const stream = new Readable({
                    read() { }
                }) as any

                archive.on('data', (chunk) => stream.push(chunk))
                archive.on('end', () => stream.push(null))
                archive.on('error', (err) => stream.emit('error', err))

                // Append files from the directory
                archive.directory(fullPath, itemName)
                archive.finalize()

                return new NextResponse(stream, {
                    headers: {
                        'Content-Type': 'application/zip',
                        'Content-Disposition': `attachment; filename="${itemName}.zip"`,
                    },
                })
            } else {
                // Single file download
                const fileBuffer = await readFile(fullPath)
                return new NextResponse(fileBuffer, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': `attachment; filename="${itemName}"`,
                    },
                })
            }
        } catch (err) {
            console.error('Download error:', err)
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
