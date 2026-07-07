import { Award, Lock } from 'lucide-react'

function BadgeCard({ tier, threshold, currentCount, color }) {
  const unlocked = currentCount >= threshold

  return (
    <div
      className={`rounded-2xl p-5 text-center border ${
        unlocked ? 'bg-card shadow-soft border-transparent' : 'bg-bgsoft border-dashed border-gray-300'
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
          unlocked ? color : 'bg-gray-200 text-gray-400'
        }`}
      >
        {unlocked ? <Award size={28} /> : <Lock size={22} />}
      </div>
      <p className={`font-display font-bold text-lg ${unlocked ? 'text-ink' : 'text-gray-400'}`}>
        {tier}
      </p>
      <p className="text-xs text-subtext mt-1">
        {unlocked ? 'Unlocked' : `${threshold} donations needed`}
      </p>
    </div>
  )
}

export default BadgeCard