import { supabaseAdmin } from '../../lib/supabase'
import { getUserFromToken } from '../../lib/auth'

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const user = await getUserFromToken(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { type } = req.body

  // Daily login bonus: once per day
  if (type === 'daily_login') {
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'bonus')
      .gte('created_at', today)
    if (count > 0) {
      return res.status(429).json({ error: 'Daily login bonus already claimed' })
    }
    await supabaseAdmin.rpc('add_coins', { user_id: user.id, amount: 3, transaction_type: 'bonus', tool_name: null })
    return res.status(200).json({ success: true, added: 3 })
  }

  // Ad watch (already has daily limit in frontend, but double-check)
  const today = new Date().toISOString().split('T')[0]
  const { count } = await supabaseAdmin
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('type', 'ad_watch')
    .gte('created_at', today)

  if (count >= 10) {
    return res.status(429).json({ error: 'Daily ad limit reached (10 max)' })
  }

  await supabaseAdmin.rpc('add_coins', { user_id: user.id, amount: 1, transaction_type: 'ad_watch', tool_name: null })
  res.status(200).json({ success: true })
    }
