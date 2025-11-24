import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'uploads')

        try {
            const files = await readdir(uploadDir)

            const fileStats = await Promise.all(
                files.map(async (file) => {
                    const filepath = path.join(uploadDir, file)
                    const stats = await stat(filepath)
                    return {
                        name: file,
                        size: stats.size,
                        createdAt: stats.birthtime,
                        type: path.extname(file).toLowerCase(),
                    }
                })
            )

            // Sort by newest first
            fileStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

            return NextResponse.json({ files: fileStats })
        } catch (err) {
            // If directory doesn't exist, return empty list
            return NextResponse.json({ files: [] })
        }
    } catch (error) {
        console.error('List files error:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}
