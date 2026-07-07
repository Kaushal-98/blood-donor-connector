import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, User } from 'lucide-react'
import BloodDonorLogo from './BloodDonorLogo'
import { useLanguage } from '../LanguageContext'
import { supabase } from '../supabaseClient'

function Navbar() {
  const navigate = useNavigate()
  const { lang, toggleLang } = useLanguage()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/requests', label: 'Requests' },
    { path: '/badges', label: 'Badges' },
    { path: '/nearby-donors', label: 'Nearby Donors' },
    { path: '/nearby-hospitals', label: 'Hospitals' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="bg-card shadow-soft px-6 py-4 flex justify-between items-center flex-wrap gap-3">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center">
  <BloodDonorLogo className="text-coral" size={20} />
</div>
        <h1 className="font-display font-bold text-lg">Blood Donor Connector</h1>
      </Link>

      <div className="flex items-center gap-1 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3.5 py-2 rounded-lg font-medium transition-colors ${
              location.pathname === item.path ? 'text-coral' : 'text-subtext hover:text-ink'
            }`}
          >
            {item.label}
            {location.pathname === item.path && (
              <span className="absolute -bottom-1 left-3.5 right-3.5 h-0.5 bg-coral rounded-full"></span>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2 bg-coral text-white px-4 py-2 rounded-xl text-sm font-medium shadow-soft hover:opacity-90 transition-opacity"
        >
          <User size={16} /> Profile
        </Link>
        <button
       onClick={toggleLang}
       className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-ink hover:bg-bgsoft transition-colors"
         >
       {lang === 'en' ? 'हिंदी' : 'ENG'}
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-ink hover:bg-bgsoft transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar