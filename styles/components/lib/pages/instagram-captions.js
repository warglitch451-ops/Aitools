import { useState } from 'react'
import Navbar from '../components/Navbar'
import AdComponent from '../components/AdComponent'
import PremiumGuard from '../components/PremiumGuard'
import { supabase } from '../lib/supabase'

export default function InstagramCaptions() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch('/api/use-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'instagram_captions', input: topic, userId: user?.id })
    })
    const data = await res.json()
    if (data.error) alert(data.error)
    else setResult(data.result)
    setLoading(false)
  }

  return (
    <PremiumGuard requiredCoins={1}>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">📸 AI Instagram Caption & Hashtag Generator</h1>
        <p className="text-gray-600 mb-4">Get engaging captions + trending hashtags.</p>
        <AdComponent />
        <input
          className="w-full border p-3 rounded mt-4"
          placeholder="Describe your post (e.g., morning coffee)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <button onClick={handleGenerate} className="mt-4 bg-pink-600 text-white px-6 py-2 rounded disabled:bg-gray-400" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Captions (1 coin)'}
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
