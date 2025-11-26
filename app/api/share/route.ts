import { NextResponse } from 'next/server'
import { createShare, listShares, deleteShare } from '@/lib/shareUtils'

export async function POST(request: Request) {
    try {
        const { itemPath } = await request.json()

        if (!itemPath) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 })
        }

        const share = await createShare(itemPath)
        return NextResponse.json(share)
    } catch (error) {
        console.error('Share creation error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const shares = await listShares()
        return NextResponse.json(shares)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 })
        }
        await deleteShare(id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
