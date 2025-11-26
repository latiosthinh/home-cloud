import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const CONFIG_DIR = path.join(process.cwd(), 'uploads', '.config')
const SHARES_FILE = path.join(CONFIG_DIR, 'shares.json')

export interface Share {
    id: string
    path: string // Relative path to uploads
    createdAt: string
    expiresAt?: string // Optional expiration
    views: number
}

async function ensureConfigDir() {
    try {
        await mkdir(CONFIG_DIR, { recursive: true })
    } catch (error) {
        // Ignore if exists
    }
}

async function loadShares(): Promise<Share[]> {
    await ensureConfigDir()
    try {
        const data = await readFile(SHARES_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

async function saveShares(shares: Share[]) {
    await ensureConfigDir()
    await writeFile(SHARES_FILE, JSON.stringify(shares, null, 2))
}

export async function createShare(relativePath: string, expiresInHours?: number): Promise<Share> {
    const shares = await loadShares()

    // Check if already shared
    const existing = shares.find(s => s.path === relativePath)
    if (existing) return existing

    const share: Share = {
        id: uuidv4(),
        path: relativePath,
        createdAt: new Date().toISOString(),
        views: 0,
        expiresAt: expiresInHours
            ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
            : undefined
    }

    shares.push(share)
    await saveShares(shares)
    return share
}

export async function getShare(id: string): Promise<Share | null> {
    const shares = await loadShares()
    const share = shares.find(s => s.id === id)

    if (!share) return null

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
        await deleteShare(id)
        return null
    }

    return share
}

export async function incrementShareViews(id: string) {
    const shares = await loadShares()
    const index = shares.findIndex(s => s.id === id)
    if (index !== -1) {
        shares[index].views = (shares[index].views || 0) + 1
        await saveShares(shares)
    }
}

export async function deleteShare(id: string) {
    const shares = await loadShares()
    const newShares = shares.filter(s => s.id !== id)
    await saveShares(newShares)
}

export async function listShares(): Promise<Share[]> {
    return loadShares()
}
