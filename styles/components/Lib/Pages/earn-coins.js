import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import AdComponent from '../components/AdComponent'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function EarnCoins() {
  const [balance, setBalance] = useState(0)
  const [user, setUser] = useState(null)

  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('wallets').select('coin_balance').eq('user_id', user.id).single()
      setBalance(data?.coin_balance || 0)
      setUser(user)
    }
  }

  useEffect(() => { fetchBalance() }, [])

  const handleBuyCoins = async (amount, priceCents) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login first')
      return
    }
    const res = await fetch('/api/purchase-coins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, priceCents })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold">Earn Free Coins</h1>
        <div className="my-4 text-2xl">🪙 Current Balance: {balance} coins</div>

        {!user && <p className="text-red-500">Login to start earning coins.</p>}

        <div className="border rounded p-4 my-4">
          <h2 className="text-xl font-semibold">Watch Ads</h2>
          <p>Watch a short video ad → earn 1 coin (max 10/day)</p>
          <AdComponent onAdComplete={fetchBalance} />
        </div>

        <div className="border rounded p-4 my-4">
          <h2 className="text-xl font-semibold">Daily Login Bonus</h2>
          <button
            onClick={async () => {
              const res = await fetch('/api/add-coins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'daily_login' })
              })
              if (res.ok) {
                alert('+3 coins! Check back tomorrow.')
                fetchBalance()
              } else {
                alert('Already claimed today')
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Claim +3 Coins
          </button>
        </div>

        <div className="border rounded p-4 my-4">
          <h2 className="text-xl font-semibold">Buy Coins</h2>
          <div className="flex gap-4 justify-center mt-2">
            <button onClick={() => handleBuyCoins(50, 500)} className="bg-green-600 text-white px-4 py-2 rounded">50 Coins – $5</button>
            <button onClick={() => handleBuyCoins(120, 1000)} className="bg-green-600 text-white px-4 py-2 rounded">120 Coins – $10 (save 20%)</button>
            <button onClick={() => handleBuyCoins(300, 2000)} className="bg-green-600 text-white px-4 py-2 rounded">300 Coins – $20 (save 33%)</button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Or <Link href="/pricing" className="text-blue-600">subscribe for unlimited access</Link> – no coins needed.
        </p>
      </div>
    </div>
  )
}
