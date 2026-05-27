import { stripe } from '../../lib/stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { amount, priceCents } = req.body
  // priceCents is in cents, e.g., 500 = $5 for 50 coins

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `${amount} Coins` },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.headers.origin}/dashboard?coins_added=${amount}`,
    cancel_url: `${req.headers.origin}/earn-coins`,
    metadata: { coinAmount: amount },
  })

  res.status(200).json({ url: session.url })
}
