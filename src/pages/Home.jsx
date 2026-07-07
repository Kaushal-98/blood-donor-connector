import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import HandoffTransition from '../components/HandoffTransition'
import NotificationListener from '../components/NotificationListener'
import AvatarStack from '../components/AvatarStack'
import Footer from '../components/Footer'
import DnaBackground from '../components/DnaBackground'
import Navbar from '../components/Navbar'
import CountUp from '../components/CountUp'
import QuickLinks from '../components/QuickLinks'
import RecentRequestsCard from '../components/RecentRequestsCard'
import ImpactCard from '../components/ImpactCard'
import DidYouKnowCard from '../components/DidYouKnowCard'
import { useLanguage } from '../LanguageContext'
import { Heart, Droplet, Users, MapPin, User, HandHeart } from 'lucide-react'

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']
const GROUP_COLORS = {
  'O+': 'text-coral', 'O-': 'text-coral',
  'A+': 'text-orange-500', 'A-': 'text-orange-500',
  'B+': 'text-coral', 'B-': 'text-blue-500',
  'AB+': 'text-purple-500', 'AB-': 'text-purple-500',
}

function Home() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [transition, setTransition] = useState(null)
  const [bloodCounts, setBloodCounts] = useState({})
  const [vitalFeed, setVitalFeed] = useState({ critical: null, normal: null })

  const handleCardClick = (path, label) => {
    setTransition({ path, label })
    setTimeout(() => {
      navigate(path)
    }, 2000)
  }

  useEffect(() => {
    loadCounts()
    loadVitalFeed()
  }, [])

  const loadCounts = async () => {
    const { data: donors } = await supabase
      .from('profiles')
      .select('blood_group')
      .eq('is_donor', true)

    const counts = {}
    BLOOD_GROUPS.forEach((g) => (counts[g] = 0))
    ;(donors || []).forEach((d) => {
      if (d.blood_group) counts[d.blood_group] = (counts[d.blood_group] || 0) + 1
    })
    setBloodCounts(counts)
  }

  const loadVitalFeed = async () => {
    const { data: critical } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'open')
      .eq('urgency', 'critical')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: normal } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'open')
      .eq('urgency', 'normal')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setVitalFeed({ critical: critical || null, normal: normal || null })
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <NotificationListener />
      <DnaBackground />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-6 relative z-10">
        <section className="relative grid md:grid-cols-2 gap-8 items-center mb-6">
          <div className="animate-fadeUp">
            <div className="inline-flex items-center gap-2 bg-coral/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 rounded-full bg-coral"></span>
              <p className="text-xs font-medium text-coral uppercase tracking-wide">
                {t('liveNetwork')}
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-3">
              {t('tagline1')}<br />
              <span className="text-coral">{t('tagline2')}</span>
            </h2>
            <p className="text-subtext text-base mb-5 max-w-md">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
  <button
    onClick={() => handleCardClick('/post-request', 'Every drop counts')}
    className="flex items-center gap-2 bg-coral text-white px-5 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition-opacity"
  >
    <Droplet size={18} /> {t('postRequest')} <span>→</span>
  </button>
  <button
    onClick={() => handleCardClick('/requests', 'Finding donors near you')}
    className="flex items-center gap-2 bg-card text-ink px-5 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition-opacity"
  >
    <Users size={18} /> {t('findDonors')} <span>→</span>
  </button>
</div>
          </div>

          <div className="relative z-10 bg-card rounded-3xl shadow-softLg p-5 md:mr-10 overflow-hidden">
            <div className="scanline"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-subtext font-medium uppercase tracking-wide">Vital Feed</span>
              <span className="flex items-center gap-1.5 text-xs text-coral font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-heartbeat"></span>
                LIVE
              </span>
            </div>

            <svg viewBox="0 0 400 60" className="w-full h-12 mb-3">
              <polyline
                points="0,30 60,30 75,10 90,50 105,5 120,30 400,30"
                fill="none"
                stroke="#FF4757"
                strokeWidth="2"
                strokeDasharray="500"
                className="animate-drawLine"
              />
            </svg>

            <div className="space-y-2">
              {vitalFeed.critical ? (
                <Link
                  to={`/requests/${vitalFeed.critical.id}`}
                  className="flex justify-between items-center bg-bgsoft rounded-xl px-4 py-2.5 hover:bg-coral/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-coral/15 flex items-center justify-center text-coral text-xs font-bold">
                      {vitalFeed.critical.blood_group_needed}
                    </span>
                    <span className="text-sm font-medium">{vitalFeed.critical.hospital_name}</span>
                  </div>
                  <span className="text-coral text-xs font-medium">● Critical</span>
                </Link>
              ) : (
                <div className="flex justify-between items-center bg-bgsoft rounded-xl px-4 py-2.5">
                  <span className="text-sm text-subtext">No critical requests right now</span>
                </div>
              )}

              {vitalFeed.normal ? (
                <Link
                  to={`/requests/${vitalFeed.normal.id}`}
                  className="flex justify-between items-center bg-bgsoft rounded-xl px-4 py-2.5 hover:bg-mint/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-mint/15 flex items-center justify-center text-mint text-xs font-bold">
                      {vitalFeed.normal.blood_group_needed}
                    </span>
                    <span className="text-sm font-medium">{vitalFeed.normal.hospital_name}</span>
                  </div>
                  <span className="text-mint text-xs font-medium">● Normal</span>
                </Link>
              ) : (
                <div className="flex justify-between items-center bg-bgsoft rounded-xl px-4 py-2.5">
                  <span className="text-sm text-subtext">No normal requests right now</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="relative z-10 bg-card rounded-2xl shadow-soft p-4 mb-6 grid grid-cols-3 divide-x divide-gray-100">
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral">
              <Users size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-bold"><CountUp end={500} suffix="+" /></p>
              <p className="text-subtext text-xs">{t('donorsRegistered')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral">
              <Heart size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-bold"><CountUp end={120} suffix="+" /></p>
              <p className="text-subtext text-xs">{t('livesSaved')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral">
              <MapPin size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-bold"><CountUp end={30} suffix="+" /></p>
              <p className="text-subtext text-xs">{t('citiesCovered')}</p>
            </div>
          </div>
        </section>

        <div className="relative z-10 grid lg:grid-cols-3 gap-4 mb-4">
          <div
            onClick={() => handleCardClick('/post-request', 'Every drop counts')}
            className="bg-card rounded-2xl shadow-soft p-4 card-hover flex flex-col cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center mb-2 text-coral">
              <Droplet size={16} />
            </div>
            <h3 className="font-display font-semibold text-base mb-0.5">{t('needBlood')}</h3>
            <p className="text-subtext text-sm mb-2">{t('needBloodDesc')}</p>
            <span className="inline-block bg-coral text-white text-sm font-medium px-4 py-1.5 rounded-lg w-fit mb-1">
              {t('postRequest')} <span>→</span>
            </span>
            <AvatarStack
              count={250}
              label="Active Donors Nearby"
              colors={['bg-orange-400', 'bg-red-400', 'bg-yellow-500']}
            />
          </div>

          <div
            onClick={() => handleCardClick('/profile', 'Give the gift of life')}
            className="bg-card rounded-2xl shadow-soft p-4 card-hover flex flex-col cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center mb-2 text-mint">
              <HandHeart size={16} />
            </div>
            <h3 className="font-display font-semibold text-base mb-0.5">{t('wantDonate')}</h3>
            <p className="text-subtext text-sm mb-2">{t('wantDonateDesc')}</p>
            <span className="inline-flex items-center gap-2 border border-mint text-mint text-sm font-medium px-4 py-1.5 rounded-lg w-fit mb-1">
              <User size={16} /> {t('iWantToDonate')} <span>→</span>
            </span>
            <AvatarStack
              count={180}
              label="Ready to Help"
              colors={['bg-pink-400', 'bg-gray-500', 'bg-blue-400']}
            />
          </div>

          <div className="bg-card rounded-2xl shadow-soft p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-semibold text-base">{t('bloodGroups')}</h3>
              <Link to="/nearby-donors" className="text-xs text-purple-500 font-medium">{t('viewAll')}</Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BLOOD_GROUPS.map((group) => (
                <div key={group} className="bg-bgsoft rounded-xl p-2">
                  <p className={`font-display font-bold text-base ${GROUP_COLORS[group]}`}>{group}</p>
                  <p className="text-sm font-semibold">{bloodCounts[group] || 0}</p>
                  <p className="text-xs text-subtext">{t('donors')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mb-4">
          <QuickLinks />
        </div>

        <div className="relative z-10 grid lg:grid-cols-3 gap-4">
          <RecentRequestsCard />
          <ImpactCard />
          <DidYouKnowCard />
        </div>
      </div>

      <HandoffTransition
        show={!!transition}
        imageSrc="images/handoff.png"
        label={transition?.label}
      />
      <Footer />
    </div>
  )
}

export default Home