import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Chat() {
  const { responseId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [otherPerson, setOtherPerson] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    initChat()
  }, [responseId])

  const initChat = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    const { data: response } = await supabase
      .from('request_responses')
      .select('*, requests(requester_id, hospital_name, profiles:requester_id(full_name)), donor:donor_id(full_name)')
      .eq('id', responseId)
      .single()

    if (response) {
      const isDonor = response.donor_id === user.id
      setOtherPerson(isDonor ? response.requests?.profiles?.full_name : response.donor?.full_name)
    }

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('response_id', responseId)
      .order('created_at', { ascending: true })
    setMessages(msgs || [])
    setLoading(false)

    const channel = supabase
      .channel(`chat-${responseId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `response_id=eq.${responseId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return

    const content = newMsg
    setNewMsg('')

    await supabase.from('messages').insert({
      response_id: responseId,
      sender_id: currentUser.id,
      content,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bgsoft flex items-center justify-center">
        <p className="text-subtext text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bgsoft text-ink font-body flex flex-col">
      <div className="bg-card shadow-soft px-6 py-4 flex items-center gap-3">
        <Link to="/dashboard" className="text-subtext hover:text-ink transition-colors">
          ←
        </Link>
        <div>
          <p className="text-xs text-mint uppercase tracking-widest font-medium">Chat with</p>
          <h2 className="font-display font-semibold">{otherPerson || 'User'}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl w-full mx-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-subtext text-sm text-center mt-10">No messages yet. Say hello 👋</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUser.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-soft ${
                  isMine
                    ? 'bg-coral text-white rounded-br-sm'
                    : 'bg-card text-ink border border-gray-100 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-gray-100 bg-card px-6 py-4 flex gap-3 max-w-2xl w-full mx-auto"
      >
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-bgsoft border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder:text-subtext focus:outline-none focus:border-coral transition-colors"
        />
        <button
          type="submit"
          className="bg-coral text-white px-5 py-2.5 rounded-lg font-medium shadow-soft hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat