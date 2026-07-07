import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import { Droplet, Utensils, Moon, GlassWater, Dumbbell, CheckCircle2, XCircle } from 'lucide-react'

const TIPS = [
  {
    icon: GlassWater,
    title: 'Stay Hydrated',
    desc: 'Drink plenty of water before and after donating blood to help your body recover faster.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: Utensils,
    title: 'Eat Iron-Rich Foods',
    desc: 'Include spinach, red meat, beans and lentils in your diet to maintain healthy haemoglobin levels.',
    color: 'text-coral bg-coral/10',
  },
  {
    icon: Moon,
    title: 'Get Enough Sleep',
    desc: 'Aim for 7-8 hours of sleep before donation day to keep your body well-rested.',
    color: 'text-purple-500 bg-purple-50',
  },
  {
    icon: Dumbbell,
    title: 'Avoid Heavy Exercise',
    desc: "Skip intense workouts for 24 hours after donating to let your body replenish blood volume.",
    color: 'text-mint bg-mint/10',
  },
]

const ELIGIBILITY = [
  { text: 'Age between 18-65 years', ok: true },
  { text: 'Weight above 50 kg', ok: true },
  { text: 'Haemoglobin level 12.5 g/dL or higher', ok: true },
  { text: 'No fever, cold or infection currently', ok: true },
  { text: 'At least 90 days since last donation', ok: true },
  { text: 'Not pregnant or breastfeeding', ok: true },
]

function HealthTips() {
  const [lastDonation, setLastDonation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('last_donated_at')
      .eq('id', user.id)
      .single()

    setLastDonation(profile?.last_donated_at || null)
    setLoading(false)
  }

  const daysSinceLastDonation = lastDonation
    ? Math.floor((new Date() - new Date(lastDonation)) / (1000 * 60 * 60 * 24))
    : null

  const isEligibleByTime = daysSinceLastDonation === null || daysSinceLastDonation >= 90
  const daysRemaining = daysSinceLastDonation !== null ? Math.max(0, 90 - daysSinceLastDonation) : 0

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-bold mb-1">Health Tips</h2>
        <p className="text-subtext text-sm mb-8">Stay healthy and eligible to donate blood.</p>

        {!loading && (
          <div
            className={`rounded-2xl p-5 mb-8 flex items-center gap-4 ${
              isEligibleByTime ? 'bg-mint/10' : 'bg-coral/10'
            }`}
          >
            {isEligibleByTime ? (
              <CheckCircle2 className="text-mint shrink-0" size={28} />
            ) : (
              <XCircle className="text-coral shrink-0" size={28} />
            )}
            <div>
              <p className={`font-medium ${isEligibleByTime ? 'text-mint' : 'text-coral'}`}>
                {isEligibleByTime ? "You're eligible to donate!" : 'Not eligible yet'}
              </p>
              <p className="text-subtext text-sm mt-0.5">
                {isEligibleByTime
                  ? 'It has been enough time since your last donation.'
                  : `Please wait ${daysRemaining} more day(s) since your last donation.`}
              </p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {TIPS.map((tip) => (
            <div key={tip.title} className="bg-card rounded-2xl shadow-soft p-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${tip.color}`}>
                <tip.icon size={20} />
              </div>
              <h3 className="font-display font-semibold mb-1">{tip.title}</h3>
              <p className="text-subtext text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex items-center gap-2 mb-4">
            <Droplet className="text-coral" size={18} />
            <h3 className="font-display font-semibold text-lg">Donation Eligibility Checklist</h3>
          </div>
          <div className="space-y-3">
            {ELIGIBILITY.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <CheckCircle2 className="text-mint shrink-0" size={18} />
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthTips