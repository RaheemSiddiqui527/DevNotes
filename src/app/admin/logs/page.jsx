"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminLogs() {
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Admin gating
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setMe(data.user)
      } catch (_) {
        setMe(null)
      } finally {
        setAuthLoading(false)
      }
    }
    loadMe()
  }, [])

  const isAdmin = useMemo(() => {
    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    return !!(me?.email && admins.includes(String(me.email).toLowerCase()))
  }, [me])

  useEffect(() => {
    if (!authLoading) {
      if (!me) router.replace('/auth')
      else if (!isAdmin) router.replace('/dashboard')
    }
  }, [authLoading, me, isAdmin, router])

  const [type, setType] = useState('') // '', 'login', 'upload'
  const [limit, setLimit] = useState('200')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = async () => {
    if (!isAdmin) return
    setLoading(true)
    setMsg('')
    try {
      const qs = new URLSearchParams()
      if (type) qs.set('type', type)
      if (limit) qs.set('limit', limit)
      const res = await fetch(`/api/admin/logs?${qs.toString()}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Failed to load'); setItems([]); return }
      setItems(Array.isArray(data.events) ? data.events : [])
    } catch (_) {
      setMsg('Network error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading…</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Back to Admin
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">System Logs</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white">
              <option value="">All Types</option>
              <option value="login">Login</option>
              <option value="upload">Upload</option>
            </select>
            <select value={limit} onChange={(e) => setLimit(e.target.value)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white">
              {[50, 100, 200, 500, 1000].map(n => <option key={n} value={n}>{n} rows</option>)}
            </select>
            <button onClick={load} className="px-3 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">Refresh</button>
          </div>
          {msg && <div className="mt-3 text-sm text-purple-200">{msg}</div>}
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 text-left text-gray-300 font-medium">Type</th>
                  <th className="p-3 text-left text-gray-300 font-medium">When</th>
                  <th className="p-3 text-left text-gray-300 font-medium">Email</th>
                  <th className="p-3 text-left text-gray-300 font-medium">Meta</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-6 text-gray-400">Loading logs…</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-gray-400">No events found</td></tr>
                ) : (
                  items.map((e, idx) => (
                    <tr key={e.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-3 font-medium text-purple-200">{e.type.toUpperCase()}</td>
                      <td className="p-3 text-gray-300">{new Date(e.when).toLocaleString()}</td>
                      <td className="p-3 text-gray-300">{e.email || '—'}</td>
                      <td className="p-3 text-gray-300 text-xs"><pre className="whitespace-pre-wrap break-words">{JSON.stringify(e.meta || {}, null, 2)}</pre></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-white/10">
            {loading ? (
              <div className="p-6 text-gray-400">Loading logs…</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-gray-400">No events found</div>
            ) : (
              items.map((e) => (
                <div key={e.id} className="p-4">
                  <div className="flex justify-between">
                    <div className="font-semibold text-purple-200">{e.type.toUpperCase()}</div>
                    <div className="text-xs text-gray-400">{new Date(e.when).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-gray-300">{e.email || '—'}</div>
                  <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words mt-2">{JSON.stringify(e.meta || {}, null, 2)}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <footer className="bg-black/50 py-8 border-t border-white/20">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div className="text-gray-300 font-medium">
          DevNotes • Developer Cheat Sheets <br className="md:hidden" />
          <span className="text-sm text-gray-400">by CodeWithRaheem</span>
        </div>

        {/* Right: Social & Info */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-gray-400 text-sm">
            Updated regularly • Copy & use safely
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="https://github.com/siddiquiraheem527" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" 
                alt="GitHub" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://twitter.com/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg" 
                alt="Twitter" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
            <a href="https://www.linkedin.com/in/codewithraheem" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" 
                alt="LinkedIn" 
                className="w-5 h-5 filter invert hover:invert-0 transition"
              />
            </a>
          </div>
        </div>

      </div>
    </footer>
    </div>
  )
}
