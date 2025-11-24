import { NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { config } from '@/lib/config'

export async function POST(request: Request) {
    const body = await request.json()
    const { password } = body
    console.log(password)
    console.log(config.appPassword)

    if (password === config.appPassword) {
        const cookie = serialize('auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Set-Cookie': cookie },
        })
    }

    return new NextResponse(JSON.stringify({ success: false, message: 'Invalid password' }), {
        status: 401,
    })
}
