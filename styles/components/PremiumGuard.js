import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function PremiumGuard({ children, requiredCoins = 0 }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data: userData } = await supabase.from('users').select('is_premium').eq('id', user.id).single()
      if (userData?.is_premium) {
        setAuthorized(true)
        return
      }
      if (requiredCoins > 0) {
        const { data: wallet } = await supabase.from('wallets').select('coin_balance').eq('user_id', user.id).single()
        if (wallet && wallet.coin_balance >= requiredCoins) {
          setAuthorized(true)
        } else {
          router.push(`/earn-coins?error=need_${requiredCoins}_coins`)
        }
      } else {
        setAuthorized(true)
      }
    }
    check()
  }, [requiredCoins])

  if (!authorized) return <div className="text-center p-10">Checking access...</div>
  return children
}
