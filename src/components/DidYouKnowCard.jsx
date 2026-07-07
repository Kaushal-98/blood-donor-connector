import { Info } from 'lucide-react'
import { useLanguage } from '../LanguageContext'

function DidYouKnowCard() {
  const { t } = useLanguage()

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Info className="text-coral" size={18} />
        <h3 className="font-display font-semibold text-lg">{t('didYouKnow')}</h3>
      </div>

      <p className="text-subtext text-sm mb-2">{t('didYouKnowText1')}</p>
      <p className="text-subtext text-sm">{t('didYouKnowText2')}</p>

      <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto mt-6 opacity-80">
        <path
          d="M50 20 C30 5, 5 20, 5 40 C5 55, 25 65, 50 85 C75 65, 95 55, 95 40 C95 20, 70 5, 50 20 Z"
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="3"
        />
        <rect x="42" y="10" width="16" height="30" rx="4" fill="#FF6B6B" opacity="0.15" stroke="#FF6B6B" strokeWidth="2" />
        <rect x="45" y="18" width="10" height="14" fill="#FF6B6B" />
      </svg>
    </div>
  )
}

export default DidYouKnowCard