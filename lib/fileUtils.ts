import path from 'path'
import { mkdir, rm, readdir, stat } from 'fs/promises'

/**
 * Validates and sanitizes a file/folder path to prevent directory traversal attacks
 */
export function validatePath(userPath: string): { isValid: boolean; error?: string } {
    // Check for null bytes
    if (userPath.includes('\0')) {
        return { isValid: false, error: 'Invalid path: null bytes detected' }
    }

    // Check for directory traversal attempts
    if (userPath.includes('..') || userPath.includes('~')) {
        return { isValid: false, error: 'Invalid path: directory traversal detected' }
    }

    // Check for absolute paths
    if (path.isAbsolute(userPath)) {
        return { isValid: false, error: 'Invalid path: absolute paths not allowed' }
    }

    return { isValid: true }
}

/**
 * Safely joins paths within the uploads directory
 */
export function safeJoinPath(basePath: string, userPath: string): string {
    const normalized = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '')
    return path.join(basePath, normalized)
}

/**
 * Gets the uploads directory path
 */
export function getUploadsDir(): string {
    return path.join(process.cwd(), 'uploads')
}

/**
 * Sanitizes a filename or folder name
 */
export function sanitizeName(name: string): string {
    // Remove illegal characters for Windows/Linux/macOS
    // < > : " / \ | ? *
    return name.replace(/[<>:"/\\|?*]/g, '').trim()
}

/**
 * Creates a directory recursively if it doesn't exist
 */
export async function ensureDir(dirPath: string): Promise<void> {
    try {
        await mkdir(dirPath, { recursive: true })
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw error
        }
    }
}

/**
 * Recursively deletes a directory or file
 */
export async function deleteRecursive(targetPath: string): Promise<void> {
    await rm(targetPath, { recursive: true, force: true })
}

/**
 * Gets file/folder stats with type information
 */
export interface FileSystemItem {
    name: string
    path: string
    size: number
    createdAt: Date
    modifiedAt: Date
    isDirectory: boolean
    type?: string
}

export async function getItemStats(itemPath: string, itemName: string, relativePath: string): Promise<FileSystemItem> {
    const stats = await stat(itemPath)
    const isDirectory = stats.isDirectory()

    return {
        name: itemName,
        path: relativePath,
        size: isDirectory ? 0 : stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        isDirectory,
        type: isDirectory ? 'folder' : path.extname(itemName).toLowerCase(),
    }
}

/**
 * Reads directory contents and returns file system items
 */
export async function readDirectoryContents(dirPath: string, currentPath: string = ''): Promise<FileSystemItem[]> {
    try {
        const items = await readdir(dirPath)
        const itemStats = await Promise.all(
            items.map(async (item) => {
                const itemPath = path.join(dirPath, item)
                const relativePath = currentPath ? path.join(currentPath, item) : item
                return getItemStats(itemPath, item, relativePath)
            })
        )
        return itemStats
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []
        }
        throw error
    }
}

/**
 * Counts items in a directory recursively
 */
export async function countItemsRecursive(dirPath: string): Promise<number> {
    try {
        const items = await readdir(dirPath)
        let count = items.length

        for (const item of items) {
            const itemPath = path.join(dirPath, item)
            const stats = await stat(itemPath)
            if (stats.isDirectory()) {
                count += await countItemsRecursive(itemPath)
            }
        }

        return count
    } catch (error) {
        return 0
    }
}
