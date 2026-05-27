import { useState } from 'react'
import Navbar from '../components/Navbar'
import AdComponent from '../components/AdComponent'
import PremiumGuard from '../components/PremiumGuard'
import { supabase } from '../lib/supabase'

export default function ContentCalendar() {
  const [niche, setNiche] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch('/api/use-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'content_calendar', input: niche, userId: user?.id })
    })
    const data = await res.json()
    if (data.error) alert(data.error)
    else setResult(data.result)
    setLoading(false)
  }

  return (
    <PremiumGuard requiredCoins={8}>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">📅 AI Content Calendar (30 Days)</h1>
        <p className="text-gray-600 mb-4">Plan a month of posts for your niche.</p>
        <AdComponent />
        <input
          className="w-full border p-3 rounded mt-4"
          placeholder="Your niche (e.g., fitness, travel, tech)"
          value={niche}
          onChange={e => setNiche(e.target.value)}
        />
        <button onClick={handleGenerate} className="mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:bg-gray-400" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Calendar (8 coins)'}
        </button>
        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </PremiumGuard>
  )
    }
