import { loadEnvConfig } from '@next/env'

// Load environment variables using Next.js's official package
const projectDir = process.cwd()
loadEnvConfig(projectDir)

export const config = {
    appPassword: process.env.APP_PASSWORD || process.env.NEXT_PUBLIC_APP_PASSWORD,
}
