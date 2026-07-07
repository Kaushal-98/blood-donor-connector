import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function PostRequest() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [units, setUnits] = useState(1)
  const [hospitalName, setHospitalName] = useState('')
  const [hospitalAddress, setHospitalAddress] = useState('')
  const [city, setCity] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }

    const { error } = await supabase.from('requests').insert({
      requester_id: user.id,
      blood_group_needed: bloodGroup,
      units_needed: units,
      hospital_name: hospitalName,
      hospital_address: hospitalAddress,
      city,
      urgency,
      status: 'open',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/requests')
    }
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <Link to="/" className="text-subtext text-sm hover:text-ink transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-card rounded-3xl shadow-softLg p-8 mt-4">
          <p className="text-xs text-coral font-medium uppercase tracking-wide mb-2">🚨 Emergency Request</p>
          <h2 className="font-display text-2xl font-bold mb-6">Post a Request</h2>

          {error && <p className="text-coral text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-subtext uppercase tracking-wide mb-2">Blood Group Needed</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((group) => (
                  <button
                    type="button"
                    key={group}
                    onClick={() => setBloodGroup(group)}
                    className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                      bloodGroup === group
                        ? 'bg-coral border-coral text-white'
                        : 'bg-bgsoft border-gray-200 text-subtext hover:border-coral/40'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-subtext uppercase tracking-wide mb-2">Units Needed</label>
              <input
                type="number"
                min="1"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-coral/50 transition-colors"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
              required
            />

            <input
              type="text"
              placeholder="Hospital Address"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
              required
            />

            <div>
              <label className="block text-xs text-subtext uppercase tracking-wide mb-2">Urgency</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('critical')}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    urgency === 'critical'
                      ? 'bg-coral border-coral text-white'
                      : 'bg-bgsoft border-gray-200 text-subtext hover:border-coral/40'
                  }`}
                >
                  🔴 Critical
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('normal')}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    urgency === 'normal'
                      ? 'bg-mint border-mint text-white'
                      : 'bg-bgsoft border-gray-200 text-subtext hover:border-mint/40'
                  }`}
                >
                  🟢 Normal
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !bloodGroup}
              className="w-full bg-coral text-white py-3 rounded-xl font-medium shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostRequest