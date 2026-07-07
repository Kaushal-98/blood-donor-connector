import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

function Dashboard() {
  const [myRequests, setMyRequests] = useState([])
  const [myResponses, setMyResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    const { data: reqs } = await supabase
      .from('requests')
      .select('*')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false })
    setMyRequests(reqs || [])

    const { data: resps } = await supabase
      .from('request_responses')
      .select('*, requests(hospital_name, blood_group_needed, city, status)')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false })
    setMyResponses(resps || [])

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-bold mb-8">My Dashboard</h2>

        {loading ? (
          <p className="text-subtext text-sm">Loading...</p>
        ) : (
          <>
            <div className="mb-10">
              <p className="text-xs text-coral font-medium uppercase tracking-wide mb-3">
                My Requests ({myRequests.length})
              </p>
              {myRequests.length === 0 && <p className="text-subtext text-sm">You haven't posted any requests yet.</p>}
              <div className="space-y-3">
                {myRequests.map((r) => (
                  <Link
                    key={r.id}
                    to={`/requests/${r.id}`}
                    className="block bg-card rounded-xl shadow-soft p-4 card-hover"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-display font-bold text-coral mr-2">{r.blood_group_needed}</span>
                        <span className="text-sm">{r.hospital_name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          r.status === 'fulfilled' ? 'bg-mint/10 text-mint' : 'bg-gray-100 text-subtext'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-mint font-medium uppercase tracking-wide mb-3">
                My Responses ({myResponses.length})
              </p>
              {myResponses.length === 0 && <p className="text-subtext text-sm">You haven't responded to any requests yet.</p>}
              <div className="space-y-3">
                {myResponses.map((r) => (
                  <div key={r.id} className="bg-card rounded-xl shadow-soft p-4 flex justify-between items-center">
                    <div>
                      <span className="font-display font-bold text-mint mr-2">{r.requests?.blood_group_needed}</span>
                      <span className="text-sm">{r.requests?.hospital_name}</span>
                    </div>
                    <span className="text-xs text-subtext">{r.requests?.city}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard