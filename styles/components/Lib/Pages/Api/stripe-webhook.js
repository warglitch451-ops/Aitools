import { buffer } from 'micro'
import { stripe } from '../../lib/stripe'
import { supabaseAdmin } from '../../lib/supabase'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature']
  const rawBody = await buffer(req)
  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.client_reference_id || session.metadata.userId
    if (userId) {
      // Set premium status for 30 days
      const expiry = new Date(Date.now() + 30 * 24 * 3600000)
      await supabaseAdmin
        .from('users')
        .update({ is_premium: true, subscription_end_date: expiry.toISOString() })
        .eq('id', userId)
      // Give 50 bonus coins
      await supabaseAdmin.rpc('add_coins', { user_id: userId, amount: 50, transaction_type: 'bonus', tool_name: null })
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    // Find user by subscription id or customer id (simplified – you'd store stripe_customer_id)
    // For now, we skip; implement as needed.
  }

  res.status(200).json({ received: true })
}
