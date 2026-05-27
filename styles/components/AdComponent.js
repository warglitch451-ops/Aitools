import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdComponent({ onAdComplete }) {
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    const checkPremium = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setShowAd(true)
      const { data } = await supabase.from('users').select('is_premium').eq('id', user.id).single()
      setShowAd(!data?.is_premium)
    }
    checkPremium()
  }, [])

  const handleWatchAd = async () => {
    // In production, replace with actual Adsterra rewarded ad callback
    const res = await fetch('/api/add-coins', { method: 'POST' })
    if (res.ok && onAdComplete) onAdComplete()
    alert('You earned 1 coin!')
  }

  if (!showAd) return null

  return (
    <div className="my-4 p-4 border rounded bg-gray-100 text-center">
      <p className="mb-2">Watch a short ad to earn 1 coin</p>
      <button onClick={handleWatchAd} className="bg-yellow-500 px-4 py-2 rounded">Watch Ad</button>
    </div>
  )
}
