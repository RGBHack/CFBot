import { config } from 'dotenv'
config()

export const TOKEN = process.env.TOKEN
export const CODEFORCES_API = process.env.CODEFORCES_API
export const CODEFORCES_SECRET = process.env.CODEFORCES_SECRET
export const MONGO_URI = process.env.MONGO_URI
