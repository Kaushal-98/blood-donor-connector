import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../supabaseClient'
import { getDistanceKm } from '../utils/distance'
import Navbar from '../components/Navbar'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function NearbyDonors() {
  const [myLocation, setMyLocation] = useState(null)
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonors()
  }, [])

  const loadDonors = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('latitude, longitude')
      .eq('id', user.id)
      .single()

    if (!myProfile?.latitude) {
      setLoading(false)
      return
    }
    setMyLocation({ lat: myProfile.latitude, lng: myProfile.longitude })

    const { data: allDonors } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_donor', true)
      .not('latitude', 'is', null)

    const withDistance = (allDonors || [])
      .filter((d) => d.id !== user.id)
      .map((d) => ({
        ...d,
        distance: getDistanceKm(myProfile.latitude, myProfile.longitude, d.latitude, d.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)

    setDonors(withDistance)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bgsoft flex items-center justify-center">
        <p className="text-subtext text-sm">Loading...</p>
      </div>
    )
  }

  if (!myLocation) {
    return (
      <div className="min-h-screen bg-bgsoft">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-subtext mb-4">Set your location in Profile first to find nearby donors.</p>
          <Link to="/profile" className="bg-coral px-6 py-3 rounded-xl font-medium text-white">
            Go to Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Nearby Donors</h2>

        <div className="rounded-3xl overflow-hidden shadow-soft mb-6" style={{ height: '350px' }}>
          <MapContainer center={[myLocation.lat, myLocation.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <Marker position={[myLocation.lat, myLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            {donors.map((d) => (
              <Marker key={d.id} position={[d.latitude, d.longitude]}>
                <Popup>
                  {d.full_name} · {d.blood_group}
                  <br />
                  {d.distance.toFixed(1)} km away
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-3">
          {donors.length === 0 && <p className="text-subtext text-sm">No donors found nearby yet.</p>}
          {donors.map((d) => (
            <div key={d.id} className="bg-card rounded-xl shadow-soft p-4 flex items-center gap-4">
              {d.avatar_url ? (
                <img src={d.avatar_url} alt={d.full_name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-bgsoft flex items-center justify-center text-sm font-medium">
                  {d.full_name?.[0] || '?'}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{d.full_name}</p>
                <p className="text-subtext text-xs">{d.city}</p>
              </div>
              <span className="font-display font-bold text-coral">{d.blood_group}</span>
              <span className="text-mint text-sm">{d.distance.toFixed(1)} km</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NearbyDonors