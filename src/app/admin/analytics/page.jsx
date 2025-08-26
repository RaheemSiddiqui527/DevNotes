"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminAnalytics() {
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

  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    const loadAll = async () => {
      if (!isAdmin) return
      setLoading(true)
      setMsg("")
      try {
        const [rs, rl, rf] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/admin/logs?limit=1000', { cache: 'no-store' }),
          fetch('/api/files?scope=all', { cache: 'no-store' }),
        ])
        const [ds, dl, df] = await Promise.all([rs.json(), rl.json(), rf.json()])
        if (!rs.ok) throw new Error(ds.error || 'Failed to load stats')
        if (!rl.ok) throw new Error(dl.error || 'Failed to load logs')
        if (!rf.ok) throw new Error(df.error || 'Failed to load files')
        setStats(ds)
        setLogs(Array.isArray(dl.events) ? dl.events : [])
        setFiles(Array.isArray(df.files) ? df.files : [])
      } catch (e) {
        setMsg(e.message || 'Network error')
        setStats(null); setLogs([]); setFiles([])
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [isAdmin])

  // Helpers
  const lastNDays = (n) => {
    const out = []
    const d = new Date()
    d.setHours(0,0,0,0)
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(d)
      dt.setDate(d.getDate() - i)
      out.push(dt)
    }
    return out
  }
  const keyDay = (dt) => dt.toISOString().slice(0,10)

  const uploadsByDay = useMemo(() => {
    const days = lastNDays(7)
    const counts = Object.fromEntries(days.map(day => [keyDay(day), 0]))
    logs.filter(e => e.type === 'upload').forEach(e => {
      const k = keyDay(new Date(e.when))
      if (k in counts) {
        const c = Number(e.meta?.count || 0)
        counts[k] += isNaN(c) ? 1 : c
      }
    })
    return { days, counts }
  }, [logs])

  const loginsByDay = useMemo(() => {
    const days = lastNDays(7)
    const counts = Object.fromEntries(days.map(day => [keyDay(day), 0]))
    logs.filter(e => e.type === 'login').forEach(e => {
      const k = keyDay(new Date(e.when))
      if (k in counts) counts[k] += 1
    })
    return { days, counts }
  }, [logs])

  const fileTypeDist = useMemo(() => {
    const map = new Map()
    files.forEach(f => {
      const ext = ((f.name || '').split('.').pop() || '').toLowerCase()
      const key = ext || 'other'
      map.set(key, (map.get(key) || 0) + 1)
    })
    const entries = Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0,10)
    const total = files.length || 1
    return { entries, total }
  }, [files])

  const topFolders = useMemo(() => {
    const map = new Map()
    files.forEach(f => {
      const key = f.folder || 'Root'
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0,8)
  }, [files])

  const maxBar = (arr) => Math.max(1, ...arr)

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading analytics…</p>
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
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Analytics</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {msg && <div className="mb-4 text-sm text-red-300">{msg}</div>}

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 border border-white/20 rounded-xl p-4"><div className="text-sm text-gray-300">Users</div><div className="text-3xl font-bold">{stats?.userCount ?? '—'}</div></div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4"><div className="text-sm text-gray-300">Files</div><div className="text-3xl font-bold">{stats?.fileCount ?? '—'}</div></div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4"><div className="text-sm text-gray-300">Logins (24h)</div><div className="text-3xl font-bold">{stats?.loginLast24h ?? '—'}</div></div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4"><div className="text-sm text-gray-300">Recent Upload Batches</div><div className="text-3xl font-bold">{stats?.recentUploads?.length ?? 0}</div></div>
        </div>

        {/* Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="font-semibold mb-3">Logins (7 days)</div>
            <div className="space-y-2">
              {loginsByDay.days.map((d) => {
                const k = d.toISOString().slice(0,10)
                const val = loginsByDay.counts[k] || 0
                const max = maxBar(Object.values(loginsByDay.counts))
                const pct = Math.round((val / max) * 100)
                return (
                  <div key={k} className="flex items-center gap-3 text-sm">
                    <div className="w-24 text-gray-400">{k}</div>
                    <div className="flex-1 bg-white/10 rounded h-3 overflow-hidden"><div className="h-3 bg-purple-500" style={{ width: `${pct}%` }} /></div>
                    <div className="w-10 text-right text-gray-300">{val}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="font-semibold mb-3">Uploads (7 days)</div>
            <div className="space-y-2">
              {uploadsByDay.days.map((d) => {
                const k = d.toISOString().slice(0,10)
                const val = uploadsByDay.counts[k] || 0
                const max = maxBar(Object.values(uploadsByDay.counts))
                const pct = Math.round((val / max) * 100)
                return (
                  <div key={k} className="flex items-center gap-3 text-sm">
                    <div className="w-24 text-gray-400">{k}</div>
                    <div className="flex-1 bg-white/10 rounded h-3 overflow-hidden"><div className="h-3 bg-pink-500" style={{ width: `${pct}%` }} /></div>
                    <div className="w-10 text-right text-gray-300">{val}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="font-semibold mb-3">File types (top 10)</div>
            <div className="space-y-2">
              {fileTypeDist.entries.length === 0 && <div className="text-sm text-gray-400">No data</div>}
              {fileTypeDist.entries.map(([type, count]) => {
                const pct = Math.round((count / (fileTypeDist.total || 1)) * 100)
                return (
                  <div key={type} className="flex items-center gap-3 text-sm">
                    <div className="w-24 text-gray-300">{type.toUpperCase()}</div>
                    <div className="flex-1 bg-white/10 rounded h-3 overflow-hidden"><div className="h-3 bg-cyan-500" style={{ width: `${pct}%` }} /></div>
                    <div className="w-16 text-right text-gray-300">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="font-semibold mb-3">Top folders</div>
            <div className="space-y-2">
              {topFolders.length === 0 && <div className="text-sm text-gray-400">No data</div>}
              {topFolders.map(([name, count]) => {
                const max = Math.max(1, ...topFolders.map(([,c]) => c))
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={name} className="flex items-center gap-3 text-sm">
                    <div className="w-24 text-gray-300">{name}</div>
                    <div className="flex-1 bg-white/10 rounded h-3 overflow-hidden"><div className="h-3 bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                    <div className="w-16 text-right text-gray-300">{count}</div>
                  </div>
                )
              })}
            </div>
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
