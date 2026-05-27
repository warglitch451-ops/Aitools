import { useState } from 'react'
import Navbar from '../components/Navbar'
import AdComponent from '../components/AdComponent'
import PremiumGuard from '../components/PremiumGuard'
import { supabase } from '../lib/supabase'

export default function YoutubeScript() {
  const [topic, setTopic] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch('/api/use-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'youtube_script', input: topic, userId: user?.id })
    })
    const data = await res.json()
    if (data.error) alert(data.error)
    else setResult(data.result)
    setLoading(false)
  }

  return (
    <PremiumGuard requiredCoins={3}>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">🎬 AI YouTube Script Generator</h1>
        <p className="text-gray-600 mb-4">Generate viral-ready scripts with hooks, body, and CTA.</p>
        <AdComponent />
        <textarea
          className="w-full border p-3 rounded mt-4"
          rows="3"
          placeholder="Enter video topic (e.g., how to start a podcast)"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <button onClick={handleGenerate} className="mt-4 bg-red-600 text-white px-6 py-2 rounded disabled:bg-gray-400" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Script (3 coins)'}
        </button>
        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap">
            <h2 className="font-bold text-lg">Your Script:</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </PremiumGuard>
  )
    }
