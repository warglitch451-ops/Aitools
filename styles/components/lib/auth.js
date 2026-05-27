import { supabaseAdmin } from './supabase'

export async function getUserFromToken(token) {
  if (!token) return null
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  return error ? null : user
}
