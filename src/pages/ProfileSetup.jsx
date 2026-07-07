import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function ProfileSetup() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [isDonor, setIsDonor] = useState(false)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (data) {
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setBloodGroup(data.blood_group || '')
      setCity(data.city || '')
      setArea(data.area || '')
      setIsDonor(data.is_donor || false)
      setLatitude(data.latitude || null)
      setLongitude(data.longitude || null)
      setAvatarUrl(data.avatar_url || '')
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocating(false)
      },
      () => {
        setError('Could not get your location. Please allow location access.')
        setLocating(false)
      }
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    let finalAvatarUrl = avatarUrl

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, avatarFile)
      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
      finalAvatarUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        blood_group: bloodGroup,
        city,
        area,
        is_donor: isDonor,
        latitude,
        longitude,
        avatar_url: finalAvatarUrl,
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-card rounded-3xl shadow-softLg p-8">
          <p className="text-xs text-coral font-medium uppercase tracking-wide mb-2">Complete your profile</p>
          <h2 className="font-display text-2xl font-bold mb-6">Your Details</h2>

          {error && <p className="text-coral text-sm mb-4">{error}</p>}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-bgsoft flex items-center justify-center text-subtext">?</div>
              )}
              <div className="flex-1">
                <label className="block text-xs text-subtext uppercase tracking-wide mb-2">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setAvatarFile(file)
                      setAvatarUrl(URL.createObjectURL(file))
                    }
                  }}
                  className="text-xs text-subtext file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-bgsoft file:text-ink file:text-xs"
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
              required
            />

            <div>
              <label className="block text-xs text-subtext uppercase tracking-wide mb-2">Blood Group</label>
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

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
              required
            />

            <input
              type="text"
              placeholder="Area / Locality"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral/50 transition-colors"
            />

            <div>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="w-full border border-mint text-mint py-3 rounded-xl font-medium hover:bg-mint/10 transition-colors disabled:opacity-50"
              >
                {locating ? 'Getting location...' : latitude ? '📍 Location Set ✓ (tap to update)' : '📍 Use My Current Location'}
              </button>
              {latitude && (
                <p className="text-xs text-subtext mt-2 text-center">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 bg-bgsoft border border-gray-200 rounded-xl px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDonor}
                onChange={(e) => setIsDonor(e.target.checked)}
                className="w-4 h-4 accent-coral"
              />
              <span className="text-sm">I am available to donate blood</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white py-3 rounded-xl font-medium shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup