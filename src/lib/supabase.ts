import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need elevated permissions
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

// Database types
export interface Room {
  id: string
  name: string
  created_at: string
}

export interface Message {
  id: string
  room_id: string
  nickname: string
  content: string
  created_at: string
}