import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'

export default function Pricing() {
  const handleSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login first')
      return
    }
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center">Simple Pricing</h1>
        <div className="md:flex gap-6 mt-10">
          {/* Free Plan */}
          <div className="border rounded-xl p-6 flex-1 text-center">
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="text-3xl mt-2">0 coins</p>
            <p className="text-sm text-gray-600">Earn coins by watching ads</p>
            <ul className="text-left mt-4 space-y-2">
              <li>✅ Access all tools (pay per use with coins)</li>
              <li>✅ Earn up to 10 coins/day from ads</li>
              <li>✅ Daily login bonus</li>
            </ul>
            <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded" disabled>Current Plan</button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-purple-500 rounded-xl p-6 flex-1 text-center bg-purple-50">
            <h2 className="text-xl font-semibold text-purple-700">Premium</h2>
            <p className="text-3xl mt-2">$15<span className="text-sm">/month</span></p>
            <p className="text-sm text-gray-600">Unlimited access, no ads</p>
            <ul className="text-left mt-4 space-y-2">
              <li>✅ Unlimited use of all 6 AI tools</li>
              <li>✅ No coin deductions</li>
              <li>✅ 50 bonus coins every month</li>
              <li>✅ No ads anywhere</li>
              <li>✅ Priority support</li>
            </ul>
            <button onClick={handleSubscribe} className="mt-6 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
            }
