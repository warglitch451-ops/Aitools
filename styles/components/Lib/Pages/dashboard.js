import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CoinWallet from '../components/CoinWallet'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const loggedUser = data.user
      setUser(loggedUser)
      if (loggedUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('is_premium')
          .eq('id', loggedUser.id)
          .single()
        setIsPremium(userData?.is_premium || false)
      }
      setLoading(false)
    })
  }, [])

  const tools = [
    { name: 'Keyword Finder', slug: 'keyword-finder', icon: '🔍' },
    { name: 'YouTube Script', slug: 'youtube-script', icon: '🎬' },
    { name: 'Instagram Captions', slug: 'instagram-captions', icon: '📸' },
    { name: 'TikTok Hooks', slug: 'tiktok-hooks', icon: '🎵' },
    { name: 'Thumbnail Creator', slug: 'thumbnail-generator', icon: '🖼️' },
    { name: 'Content Calendar', slug: 'content-calendar', icon: '📅' },
  ]

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="text-center p-10">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="text-center p-10">
          <p>Please log in to view your dashboard.</p>
          <Link href="/login" className="text-blue-600 underline">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Welcome, {user.email?.split('@')[0] || 'User'}!</h1>
          <CoinWallet />
        </div>

        {isPremium ? (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mt-4">
            ✅ Premium active – Unlimited tool access. No coin deductions.
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded mt-4">
            ⚡ Free user – Earn coins by watching ads or <Link href="/pricing" className="underline font-bold">upgrade to premium</Link> for unlimited use.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="border rounded-xl p-5 hover:shadow-lg transition hover:border-purple-300"
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                {!isPremium && `(costs coins)`}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
      }
