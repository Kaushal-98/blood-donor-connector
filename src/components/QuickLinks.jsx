import { Link } from 'react-router-dom'
import { Shield, Calendar, Droplet, Award, HeartPulse } from 'lucide-react'
import { useLanguage } from '../LanguageContext'

function QuickLinks() {
  const { t } = useLanguage()

  const LINKS = [
    { icon: Shield, title: t('findBloodDonors'), desc: t('findBloodDonorsDesc'), path: '/nearby-donors' },
    { icon: Calendar, title: t('upcomingCamps'), desc: t('upcomingCampsDesc'), path: '/requests' },
    { icon: Droplet, title: t('donationHistory'), desc: t('donationHistoryDesc'), path: '/dashboard' },
    { icon: Award, title: t('earnBadges'), desc: t('earnBadgesDesc'), path: '/badges' },
    { icon: HeartPulse, title: t('healthTips'), desc: t('healthTipsDesc'), path: '/health-tips' },
  ]

  return (
    <div className="bg-card rounded-2xl shadow-soft p-4 flex flex-wrap gap-4 justify-between">
      {LINKS.map((item) => (
        <Link
          key={item.title}
          to={item.path}
          className="flex items-center gap-3 flex-1 min-w-[180px] px-2 py-1 rounded-xl hover:bg-bgsoft transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-coral/10 flex items-center justify-center text-coral shrink-0">
            <item.icon size={20} />
          </div>
          <div>
            <p className="font-medium text-sm">{item.title}</p>
            <p className="text-xs text-subtext">{item.desc}</p>
          </div>
          <span className="text-subtext ml-auto">→</span>
        </Link>
      ))}
    </div>
  )
}

export default QuickLinks