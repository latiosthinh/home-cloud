import { NextResponse } from 'next/server'
import { getShare, incrementShareViews } from '@/lib/shareUtils'
import { getItemStats, readDirectoryContents } from '@/lib/fileUtils'
import path from 'path'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const share = await getShare(code)

        if (!share) {
            return NextResponse.json({ error: 'Share not found or expired' }, { status: 404 })
        }

        const uploadDir = path.join(process.cwd(), 'uploads')
        const fullPath = path.join(uploadDir, share.path)
        const itemName = path.basename(share.path)

        try {
            const stats = await getItemStats(fullPath, itemName, share.path)

            // Increment view count
            await incrementShareViews(code)

            let children = []
            if (stats.isDirectory) {
                children = await readDirectoryContents(fullPath, share.path)
            }

            return NextResponse.json({
                share,
                item: stats,
                children
            })
        } catch (err) {
            return NextResponse.json({ error: 'Shared item not found' }, { status: 404 })
        }
    } catch (error) {
        console.error('Share access error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
