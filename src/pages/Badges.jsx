import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import BadgeCard from '../components/BadgeCard'
import { Droplet } from 'lucide-react'

const TIERS = [
  { tier: 'Bronze', threshold: 1, color: 'bg-orange-100 text-orange-600' },
  { tier: 'Silver', threshold: 3, color: 'bg-gray-200 text-gray-600' },
  { tier: 'Gold', threshold: 5, color: 'bg-yellow-100 text-yellow-600' },
  { tier: 'Platinum', threshold: 10, color: 'bg-purple-100 text-purple-600' },
]

function Badges() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('request_responses')
      .select('*, requests(status)')
      .eq('donor_id', user.id)

    const fulfilledCount = (data || []).filter((r) => r.requests?.status === 'fulfilled').length
    setCount(fulfilledCount)
    setLoading(false)
  }

  const nextTier = TIERS.find((t) => count < t.threshold)
  const currentTier = [...TIERS].reverse().find((t) => count >= t.threshold)
  const progressPercent = nextTier
    ? Math.min(100, (count / nextTier.threshold) * 100)
    : 100

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-bold mb-1">My Badges</h2>
        <p className="text-subtext text-sm mb-8">Earn rewards every time you help save a life.</p>

        {loading ? (
          <p className="text-subtext text-sm">Loading...</p>
        ) : (
          <>
            <div className="bg-card rounded-3xl shadow-softLg p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center text-coral">
                  <Droplet size={24} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold">{count}</p>
                  <p className="text-subtext text-sm">Completed Donations</p>
                </div>
              </div>

              {nextTier ? (
                <>
                  <div className="flex justify-between text-xs text-subtext mb-1">
                    <span>Current: {currentTier?.tier || 'None yet'}</span>
                    <span>Next: {nextTier.tier} ({nextTier.threshold})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-coral transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-subtext mt-2">
                    {nextTier.threshold - count} more donation(s) to unlock {nextTier.tier}
                  </p>
                </>
              ) : (
                <p className="text-coral font-medium text-sm">🎉 You've unlocked all badges!</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TIERS.map((t) => (
                <BadgeCard
                  key={t.tier}
                  tier={t.tier}
                  threshold={t.threshold}
                  currentCount={count}
                  color={t.color}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Badges