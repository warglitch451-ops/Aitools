import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { email } }
    })
    if (error) setError(error.message)
    else {
      // Auto create wallet and user record via database trigger
      alert('Check your email to confirm signup, then login.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-6 mt-10 border rounded shadow">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSignup} className="mt-4 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            className="w-full border p-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  )
    }
