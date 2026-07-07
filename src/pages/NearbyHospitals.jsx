import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function NearbyHospitals() {
  const [location, setLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('latitude, longitude').eq('id', user.id).single()

    if (!profile?.latitude) {
      setLoading(false)
      return
    }
    setLocation({ lat: profile.latitude, lng: profile.longitude })
    await fetchHospitals(profile.latitude, profile.longitude)
  }

  const fetchHospitals = async (lat, lng) => {
    const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lng});out body 20;`
    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query })
      const data = await res.json()
      setHospitals(data.elements || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bgsoft flex items-center justify-center">
        <p className="text-subtext text-sm">Loading...</p>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-bgsoft">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-subtext mb-4">Set your location in Profile first to find nearby hospitals.</p>
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
        <h2 className="font-display text-2xl font-bold mb-6">Nearby Hospitals</h2>

        <div className="rounded-3xl overflow-hidden shadow-soft mb-6" style={{ height: '350px' }}>
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lon]}>
                <Popup>{h.tags?.name || 'Hospital'}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-3">
          {hospitals.length === 0 && <p className="text-subtext text-sm">No hospitals found nearby.</p>}
          {hospitals.map((h) => (
            <div key={h.id} className="bg-card rounded-xl shadow-soft p-4">
              <p className="font-medium">{h.tags?.name || 'Unnamed Hospital'}</p>
              {h.tags?.['addr:street'] && <p className="text-subtext text-xs">{h.tags['addr:street']}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NearbyHospitals