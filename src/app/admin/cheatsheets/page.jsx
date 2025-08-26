"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdminCheatSheets() {
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

  const [q, setQ] = useState("")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ category: '', label: '', code: '', desc: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setMsg("")
    try {
      const res = await fetch(`/api/admin/cheatsheets?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Failed to load'); setItems([]); return }
      setItems(Array.isArray(data.cheats) ? data.cheats : [])
    } catch (_) {
      setMsg('Network error')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  const filtered = useMemo(() => {
    if (!q) return items
    const s = q.toLowerCase()
    return items.filter(i => [i.category, i.label, i.code, i.desc].some(x => (x || '').toLowerCase().includes(s)))
  }, [items, q])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg("")
    try {
      const payload = { ...form }
      if (editing?.id) payload.id = editing.id
      const res = await fetch('/api/admin/cheatsheets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setMsg(data.error || 'Save failed'); return }
      setMsg('Saved')
      setEditing(null)
      setForm({ category: '', label: '', code: '', desc: '' })
      await load()
    } catch (_) {
      setMsg('Network error')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 2500)
    }
  }

  const onEdit = (item) => {
    setEditing(item)
    setForm({ category: item.category || '', label: item.label || '', code: item.code || '', desc: item.desc || '' })
  }

  const onDelete = async (id) => {
    setMsg("")
    try {
      const res = await fetch(`/api/admin/cheatsheets?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setMsg(data.error || 'Delete failed'); return }
      await load()
    } catch (_) { setMsg('Network error') }
  }

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
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Cheat Sheets</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Search + Form */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search (category, label, code, desc)" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400" />
              <button onClick={load} className="px-3 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">
                Refresh
              </button>
            </div>
            {loading ? (
              <div className="text-gray-400">Loading cheat sheets…</div>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-auto pr-1">
                {filtered.length === 0 && (
                  <div className="text-gray-400 text-sm">No items found</div>
                )}
                {filtered.map((i) => (
                  <div key={i.id} className="bg-black/40 rounded-lg border border-white/10 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-purple-200">[{i.category}] {i.label}</div>
                        <div className="text-xs text-gray-400">Updated {new Date(i.updatedAt).toLocaleString()}</div>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <button onClick={() => onEdit(i)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">Edit</button>
                        <button onClick={() => onDelete(i.id)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-pink-400/50 text-gray-200 hover:text-white">Delete</button>
                      </div>
                    </div>
                    <pre className="mt-2 p-2 bg-black/40 rounded text-sm overflow-auto whitespace-pre-wrap break-words">{i.code}</pre>
                    {i.desc && <div className="text-sm text-gray-300 mt-1">{i.desc}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
            <h2 className="text-2xl font-bold text-purple-200 mb-4">{editing ? 'Edit Item' : 'Add New'}</h2>
            {msg && <div className="mb-3 text-sm text-purple-200">{msg}</div>}
            <form onSubmit={onSave} className="space-y-3">
              <label className="block">
                <span className="block text-sm text-gray-300 mb-1">Category</span>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400" required />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-300 mb-1">Label</span>
                <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400" required />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-300 mb-1">Code</span>
                <textarea value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} rows={8} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400" required />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-300 mb-1">Description</span>
                <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400" />
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Update' : 'Add')}</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ category: '', label: '', code: '', desc: '' }) }} className="px-4 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
