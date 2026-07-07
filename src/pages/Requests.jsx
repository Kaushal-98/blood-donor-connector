import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

function Requests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (!error) setRequests(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs text-coral font-medium uppercase tracking-wide mb-1">Active Requests</p>
            <h2 className="font-display text-2xl font-bold">Blood Needed</h2>
          </div>
          <Link
            to="/post-request"
            className="bg-coral text-white px-4 py-2 rounded-xl text-sm font-medium shadow-soft hover:opacity-90 transition-opacity"
          >
            + Post Request
          </Link>
        </div>

        {loading && <p className="text-subtext text-sm">Loading...</p>}

        {!loading && requests.length === 0 && (
          <div className="bg-card rounded-3xl shadow-soft p-8 text-center">
            <p className="text-subtext">No active requests right now.</p>
          </div>
        )}

        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-card rounded-2xl shadow-soft p-6 card-hover">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-coral">
                    {req.blood_group_needed}
                  </span>
                  <span className="text-sm text-subtext">{req.units_needed} unit(s) needed</span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    req.urgency === 'critical' ? 'bg-coral/10 text-coral' : 'bg-mint/10 text-mint'
                  }`}
                >
                  {req.urgency === 'critical' ? '🔴 Critical' : '🟢 Normal'}
                </span>
              </div>

              <p className="font-medium">{req.hospital_name}</p>
              <p className="text-sm text-subtext">{req.hospital_address}</p>
              <p className="text-sm text-subtext mb-4">{req.city}</p>

              <Link to={`/requests/${req.id}`} className="inline-block text-sm text-coral font-medium hover:underline">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Requests