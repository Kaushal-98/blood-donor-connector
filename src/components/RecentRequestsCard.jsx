import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useLanguage } from '../LanguageContext'

function RecentRequestsCard() {
  const { t } = useLanguage()
  const [requests, setRequests] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3)
    setRequests(data || [])
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold text-lg">{t('recentRequests')}</h3>
        <Link to="/requests" className="text-coral text-xs font-medium">{t('viewAllBtn')}</Link>
      </div>

      {requests.length === 0 && <p className="text-subtext text-sm">{t('noActiveRequests')}</p>}

      <div className="divide-y divide-gray-100">
        {requests.map((r) => (
          <Link
            key={r.id}
            to={`/requests/${r.id}`}
            className="flex items-center gap-3 py-3 hover:bg-bgsoft -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-coral/10 flex items-center justify-center text-coral shrink-0">
              <Droplet size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{r.blood_group_needed} {t('bloodNeededLabel')}</p>
              <p className="text-xs text-subtext">{r.hospital_name}</p>
            </div>
            <span
              className={`text-xs font-medium ${
                r.urgency === 'critical' ? 'text-coral' : 'text-subtext'
              }`}
            >
              {r.urgency === 'critical' ? t('urgent') : t('normal')}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentRequestsCard