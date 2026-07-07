import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [responses, setResponses] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [myResponse, setMyResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    const { data: reqData } = await supabase.from('requests').select('*').eq('id', id).single()
    setRequest(reqData)

    const { data: respData } = await supabase
      .from('request_responses')
      .select('*, profiles(full_name, phone, blood_group)')
      .eq('request_id', id)

    setResponses(respData || [])

    if (user && respData) {
      const mine = respData.find((r) => r.donor_id === user.id)
      setMyResponse(mine || null)
    }

    setLoading(false)
  }

  const handleRespond = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    setResponding(true)
    const { error } = await supabase.from('request_responses').insert({
      request_id: id,
      donor_id: currentUser.id,
      status: 'interested',
    })
    if (!error) await loadData()
    setResponding(false)
  }

  const handleMarkFulfilled = async () => {
    await supabase.from('requests').update({ status: 'fulfilled' }).eq('id', id)
    await loadData()
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return
    await supabase.from('requests').delete().eq('id', id)
    navigate('/requests')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bgsoft flex items-center justify-center">
        <p className="text-subtext text-sm">Loading...</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-bgsoft flex items-center justify-center">
        <p className="text-subtext">Request not found.</p>
      </div>
    )
  }

  const isOwner = currentUser && currentUser.id === request.requester_id

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to="/requests" className="text-subtext text-sm hover:text-ink transition-colors">
          ← Back to Requests
        </Link>

        <div className="bg-card rounded-3xl shadow-softLg p-8 mt-4">
          <div className="flex justify-between items-start mb-4">
            <span className="font-display text-4xl font-bold text-coral">{request.blood_group_needed}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                request.status === 'fulfilled'
                  ? 'bg-mint/10 text-mint'
                  : request.urgency === 'critical'
                  ? 'bg-coral/10 text-coral'
                  : 'bg-gray-100 text-subtext'
              }`}
            >
              {request.status === 'fulfilled' ? '✅ Fulfilled' : request.urgency === 'critical' ? '🔴 Critical' : '🟢 Normal'}
            </span>
          </div>

          <h2 className="font-display text-xl font-bold mb-1">{request.hospital_name}</h2>
          <p className="text-subtext text-sm mb-1">{request.hospital_address}</p>
          <p className="text-subtext text-sm mb-6">{request.city}</p>

          <div className="flex gap-6 mb-6 text-sm">
            <div>
              <p className="text-subtext text-xs uppercase tracking-wide mb-1">Units</p>
              <p className="font-medium">{request.units_needed}</p>
            </div>
            <div>
              <p className="text-subtext text-xs uppercase tracking-wide mb-1">Posted</p>
              <p className="font-medium">{new Date(request.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {!isOwner && request.status !== 'fulfilled' && (
            <button
              onClick={handleRespond}
              disabled={responding || myResponse}
              className="w-full bg-coral text-white py-3 rounded-xl font-medium shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {myResponse ? '✓ You responded' : responding ? 'Sending...' : 'I can donate 🩸'}
            </button>
          )}

          {isOwner && request.status !== 'fulfilled' && (
            <button
              onClick={handleMarkFulfilled}
              className="w-full border border-mint text-mint py-3 rounded-xl font-medium hover:bg-mint/10 transition-colors"
            >
              Mark as Fulfilled
            </button>
          )}

          {isOwner && (
            <button
              onClick={handleDelete}
              className="w-full mt-3 border border-coral/30 text-coral py-2.5 rounded-xl font-medium hover:bg-coral/10 transition-colors text-sm"
            >
              🗑️ Delete Request
            </button>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs text-coral font-medium uppercase tracking-wide mb-3">
            Donors Responded ({responses.length})
          </p>

          {responses.length === 0 && <p className="text-subtext text-sm">No responses yet.</p>}

          <div className="space-y-3">
            {responses.map((r) => (
              <div key={r.id} className="bg-card rounded-xl shadow-soft p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{r.profiles?.full_name || 'Donor'}</p>
                  <p className="text-subtext text-xs">{r.profiles?.blood_group}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/chat/${r.id}`} className="text-coral text-sm font-medium hover:underline">
                    💬 Chat
                  </Link>
                  {isOwner && (
                    <a href={`tel:${r.profiles?.phone}`} className="text-mint text-sm font-medium hover:underline">
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestDetail