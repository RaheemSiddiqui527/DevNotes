"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LibraryPage() {
  const [files, setFiles] = useState([])
  const [scope, setScope] = useState('mine') // 'mine' | 'all'
  const [me, setMe] = useState(null)
  const isAdmin = (() => {
    const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    return !!(me?.email && emails.includes(String(me.email).toLowerCase()))
  })()
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [authState, setAuthState] = useState('unknown') // 'unknown' | 'ok' | 'unauth'

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B"
    if (!bytes) return ""
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const value = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)
    return `${value} ${sizes[i]}`
  }

  const fetchFiles = async () => {
    try {
      const url = scope === 'all' ? '/api/files?scope=all' : '/api/files'
      const res = await fetch(url, { cache: 'no-store' })
      if (res.status === 401) {
        setAuthState('unauth')
        setFiles([])
        return
      }
      const data = await res.json()
      setFiles(Array.isArray(data.files) ? data.files : [])
      setAuthState('ok')
    } catch (_) {
      setMessage('Failed to load files')
      setAuthState('ok')
    }
  }

  useEffect(() => { fetchFiles() }, [scope])
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setMe(data.user)
      } catch (_) { setMe(null) }
    }
    loadMe()
  }, [])

  const onUpload = async (e) => {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return
    setIsUploading(true)
    setMessage("")
    try {
      const fd = new FormData()
      for (const f of selected) {
        if (f.size > 100 * 1024 * 1024) { // 100MB limit
          setMessage('File too large. Max 100MB.')
          continue
        }
        fd.append('file', f)
      }
      if (![...fd.keys()].length) return
      const res = await fetch('/api/files', { method: 'POST', body: fd })
      if (res.status === 401) {
        setAuthState('unauth')
        setMessage('Please sign in to upload files.')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Upload failed')
        return
      }
      setMessage(`${(data.saved || []).length} file(s) uploaded`)
      await fetchFiles()
      e.target.value = ''
    } catch (_) {
      setMessage('Upload failed due to network error')
    } finally {
      setIsUploading(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const viewFile = (id) => {
    window.open(`/api/files?id=${encodeURIComponent(id)}`, '_blank', 'noopener,noreferrer')
  }

  const downloadFile = async (id, name) => {
    try {
      const url = `/api/files?id=${encodeURIComponent(id)}&download=1`
      const a = document.createElement('a')
      a.href = url
      a.download = name || 'download'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (_) {}
  }

  const deleteFile = async (id) => {
    try {
      const res = await fetch(`/api/files?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) return
      setFiles((prev) => prev.filter((f) => f.id !== id))
    } catch (_) {}
  }

  // Curated resources (unchanged)
  const resources = [
    {
      category: "Docs & References",
      items: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "website" },
        { name: "Python Docs", url: "https://docs.python.org/3/", type: "website" },
        { name: "Docker Docs", url: "https://docs.docker.com/", type: "website" },
      ],
    },
    {
      category: "Books (Free)",
      items: [
        { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "book" },
        { name: "Think Python", url: "https://greenteapress.com/wp/think-python-2e/", type: "book" },
        { name: "Dive Into Docker", url: "https://docker-curriculum.com/", type: "book" },
      ],
    },
    {
      category: "Learning Platforms",
      items: [
        { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", type: "course" },
        { name: "Frontend Masters", url: "https://frontendmasters.com/", type: "course" },
        { name: "CS50 (Harvard)", url: "https://cs50.harvard.edu/x/", type: "course" },
      ],
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* Top Bar */}
      <nav className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
            ← Back to Home
          </Link>
          <div className="text-center">
            <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Library
            </span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-5 sm:pb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          Your Personal Dev Library
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Upload files are stored securely on the server and available to view or download.
        </p>
      </header>

      {/* Library Actions + List */}
      <section className="container mx-auto px-4 sm:px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-purple-200">My Files</h2>
              <p className="text-gray-300 text-sm">Supported: PDF, EPUB, TXT, MD. Max 100MB per file.</p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="inline-flex rounded-lg border border-white/20 overflow-hidden">
                  <button onClick={() => setScope('mine')} className={`px-3 py-2 text-sm ${scope==='mine' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>My Files</button>
                  <button onClick={() => setScope('all')} className={`px-3 py-2 text-sm ${scope==='all' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>All Files</button>
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 bg-white/10 text-gray-200 hover:text-white">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.epub,.txt,.md,application/pdf,application/epub+zip,text/plain,text/markdown"
                  onChange={onUpload}
                  className="hidden"
                  disabled={isUploading || authState !== 'ok'}
                />
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5" strokeWidth="2" strokeLinecap="round"/></svg>
                {isUploading ? 'Uploading...' : 'Upload File(s)'}
              </label>
            </div>
          </div>

          {message && (
            <div className="mt-3 text-sm text-purple-200">{message}</div>
          )}

          <div className="mt-5">
            {authState === 'unauth' ? (
              <div className="text-gray-300 text-sm">
                Please sign in to manage your files. <Link href="/auth" className="text-purple-300 underline underline-offset-4">Go to login</Link>
              </div>
            ) : files.length === 0 ? (
              <div className="text-gray-400 text-sm">No files yet. Use the Upload button to add your files.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((b) => (
                  <div key={b.id} className="bg-black/40 rounded-lg border border-white/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-purple-200 truncate" title={b.name}>{b.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {(b.type || 'file')} • {formatSize(b.size)} • {new Date(b.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-wrap gap-2">
                        <button onClick={() => viewFile(b.id)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">View</button>
                        <button onClick={() => downloadFile(b.id, b.name)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">Download</button>
                        {b.mine && (
                          <button onClick={() => deleteFile(b.id)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-pink-400/50 text-gray-200 hover:text-white">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Resources */}
      <section className="container mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Curated Resources
          </h2>
          <p className="text-gray-300">Docs, books and courses to explore</p>
        </motion.div>

        <div className="space-y-8">
          {resources.map((res) => (
            <section key={res.category}>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg md:text-xl font-semibold mb-3 text-purple-200"
              >
                {res.category}
              </motion.h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {res.items.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm hover:border-purple-400/50 transition-colors"
                  >
                    <div className="font-medium text-purple-200">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.type}</div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

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
            <a href="https://github.com/RaheemSiddiqui527" target="_blank" rel="noopener noreferrer">
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
