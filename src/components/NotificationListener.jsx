import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

let idCounter = 0

function NotificationListener() {
  const [toasts, setToasts] = useState([])
  const channelsRef = useRef([])

  const pushToast = (toast) => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 6000)
  }

  useEffect(() => {
    let isMounted = true

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!isMounted) return

      // Unique suffix avoids channel-name collisions when effects
      // re-run (e.g. React StrictMode double-invoking in dev)
      const suffix = Math.random().toString(36).slice(2, 8)

      const reqChannel = supabase
        .channel(`home-new-requests-${suffix}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'requests' },
          (payload) => {
            const req = payload.new
            if (user && req.requester_id === user.id) return
            pushToast({
              title: 'Blood Needed 🩸',
              message: `${req.blood_group_needed} needed at ${req.hospital_name}`,
              path: `/requests/${req.id}`,
              color: 'pulse',
            })
          }
        )
        .subscribe()

      const respChannel = supabase
        .channel(`home-new-responses-${suffix}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'request_responses' },
          async (payload) => {
            const resp = payload.new
            if (user && resp.donor_id === user.id) return

            const { data: req } = await supabase
              .from('requests')
              .select('hospital_name, blood_group_needed, requester_id')
              .eq('id', resp.request_id)
              .single()

            if (user && req?.requester_id !== user.id) return

            pushToast({
              title: 'Donor Found ✅',
              message: `Someone offered to donate ${req?.blood_group_needed || ''} for ${req?.hospital_name || 'a request'}`,
              path: `/requests/${resp.request_id}`,
              color: 'teal',
            })
          }
        )
        .subscribe()

      if (isMounted) {
        channelsRef.current = [reqChannel, respChannel]
      } else {
        // Component unmounted while we were awaiting getUser() —
        // clean up immediately instead of leaving orphaned channels
        supabase.removeChannel(reqChannel)
        supabase.removeChannel(respChannel)
      }
    }

    setup()

    return () => {
      isMounted = false
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch))
      channelsRef.current = []
    }
  }, [])

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-full max-w-xs">
      {toasts.map((toast) => (
        <Link
          key={toast.id}
          to={toast.path}
          className={`block bg-panel/90 backdrop-blur border rounded-xl p-4 shadow-lg animate-slideInRight ${
            toast.color === 'pulse' ? 'border-pulse/40' : 'border-teal/40'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2 h-2 rounded-full animate-heartbeat ${
                toast.color === 'pulse' ? 'bg-pulse' : 'bg-teal'
              }`}
            ></span>
            <p
              className={`font-mono text-xs uppercase tracking-widest ${
                toast.color === 'pulse' ? 'text-pulse' : 'text-teal'
              }`}
            >
              {toast.title}
            </p>
          </div>
          <p className="text-sm text-white">{toast.message}</p>
        </Link>
      ))}
    </div>
  )
}

export default NotificationListener