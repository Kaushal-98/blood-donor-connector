import { Droplet, Heart, Award } from 'lucide-react'
import { useLanguage } from '../LanguageContext'

function ImpactCard() {
  const { t } = useLanguage()

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <h3 className="font-display font-semibold text-lg mb-5">{t('yourImpact')}</h3>

      <div className="grid grid-cols-3 gap-3 text-center mb-5">
        <div>
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral mx-auto mb-2">
            <Droplet size={18} />
          </div>
          <p className="font-display text-xl font-bold">3</p>
          <p className="text-xs text-subtext">{t('donations')}</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral mx-auto mb-2">
            <Heart size={18} />
          </div>
          <p className="font-display text-xl font-bold">9</p>
          <p className="text-xs text-subtext">{t('livesSavedLabel')}</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center text-coral mx-auto mb-2">
            <Award size={18} />
          </div>
          <p className="font-display text-xl font-bold">Silver</p>
          <p className="text-xs text-subtext">{t('badge')}</p>
        </div>
      </div>

      <div className="bg-coral/10 rounded-xl p-4 flex items-start gap-3">
        <Droplet className="text-coral shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-coral font-medium text-sm">{t('youreHero')}</p>
          <p className="text-subtext text-xs mt-0.5">{t('heroDesc')}</p>
        </div>
      </div>
    </div>
  )
}

export default ImpactCard