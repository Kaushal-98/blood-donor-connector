import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import { supabase } from '../supabaseClient'
import DnaBackground from '../components/DnaBackground'

function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/login')
    }
  }

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  return (
    <div className="relative min-h-screen bg-bgsoft text-ink font-body flex items-center justify-center px-4">
      <DnaBackground />

      <div className="relative z-10 w-full max-w-sm animate-fadeUp">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center">
            <HeartPulse className="text-coral" size={18} fill="currentColor" />
          </div>
          <h1 className="font-display font-semibold text-lg tracking-tight">
            Blood Donor Connector
          </h1>
        </div>

        <div className="bg-card rounded-3xl shadow-softLg p-8">
          <p className="font-mono text-xs tracking-widest text-mint uppercase mb-2">
            Join the network
          </p>
          <h2 className="font-display text-2xl font-bold mb-6">Sign Up</h2>

          {error && <p className="text-coral text-sm mb-4">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral transition-colors"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bgsoft border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-subtext focus:outline-none focus:border-coral transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white py-3 rounded-lg font-medium shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50 btn-pop"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-subtext">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-lg font-medium text-ink hover:bg-bgsoft transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.59-5.17 3.59-8.79z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.07C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.62H1.28C.47 8.24 0 10.06 0 12s.47 3.76 1.28 5.38l3.99-3.07z"/>
              <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.79l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.28 6.62l3.99 3.07C6.22 6.86 8.87 4.75 12 4.75z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-subtext">
            Already have an account?{' '}
            <Link to="/login" className="text-coral font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup