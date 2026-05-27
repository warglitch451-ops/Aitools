import { supabaseAdmin } from '../../lib/supabase'
import { getUserFromToken } from '../../lib/auth'
import { generateKeywords, generateYouTubeScript, generateInstagramCaptions, generateTikTokHooks, generateThumbnailPrompt, generateContentCalendar } from '../../lib/ai'

const toolCost = {
  'keyword_finder': 2,
  'youtube_script': 3,
  'instagram_captions': 1,
  'tiktok_hooks': 1,
  'thumbnail_generator': 4,
  'content_calendar': 8,
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  const user = await getUserFromToken(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { tool, input } = req.body
  const cost = toolCost[tool]
  if (!cost) return res.status(400).json({ error: 'Invalid tool' })

  // Check premium
  const { data: userData } = await supabaseAdmin.from('users').select('is_premium').eq('id', user.id).single()
  if (!userData?.is_premium) {
    // Deduct coins
    const { data: wallet } = await supabaseAdmin.from('wallets').select('coin_balance').eq('user_id', user.id).single()
    if (!wallet || wallet.coin_balance < cost) {
      return res.status(402).json({ error: `Insufficient coins. Need ${cost} coins.` })
    }
    await supabaseAdmin.rpc('add_coins', { user_id: user.id, amount: -cost, transaction_type: 'spend', tool_name: tool })
  }

  // Generate result
  let result = ''
  switch (tool) {
    case 'keyword_finder':
      result = await generateKeywords(input)
      break
    case 'youtube_script':
      result = await generateYouTubeScript(input)
      break
    case 'instagram_captions':
      result = await generateInstagramCaptions(input)
      break
    case 'tiktok_hooks':
      result = await generateTikTokHooks(input)
      break
    case 'thumbnail_generator':
      result = await generateThumbnailPrompt(input)
      break
    case 'content_calendar':
      result = await generateContentCalendar(input)
      break
    default:
      result = `Tool "${tool}" is not yet implemented.`
  }

  res.status(200).json({ result })
      }
