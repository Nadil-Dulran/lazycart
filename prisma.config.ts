import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const url = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL

if (!url || typeof url !== 'string' || url.trim() === '') {
  throw new Error(
    'Prisma config error: DATABASE_URL is missing. Set it in your environment or .env file.'
  )
}

export default defineConfig({
  datasource: {
    url,
    directUrl,
  },
})
