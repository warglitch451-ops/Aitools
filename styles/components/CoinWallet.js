import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CoinWallet() {
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('wallets').select('coin_balance').eq('user_id', user.id).single()
      setBalance(data?.coin_balance || 0)
    }
    fetchBalance()
  }, [])

  return (
    <div className="bg-green-100 p-2 rounded inline-block">
      🪙 {balance} coins
    </div>
  )
}
