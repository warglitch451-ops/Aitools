import { stripe } from '../../lib/stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID, // e.g., 'price_1Qwerty123'
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${req.headers.origin}/dashboard?success=true`,
    cancel_url: `${req.headers.origin}/pricing`,
    client_reference_id: userId,
    metadata: { userId },
  })
  res.status(200).json({ url: session.url })
}
