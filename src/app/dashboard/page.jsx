"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setUser(data.user)
      } catch (_) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const signOut = async () => {
    try {
      setMessage("")
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth')
    } catch (_) {
      setMessage('Sign out failed')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* Top Bar */}
      <nav className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
            ← Home
          </Link>
          <div className="text-center">
            <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
        >
          {loading ? 'Loading...' : user ? `Welcome, ${user.name || user.email}` : 'Please sign in'}
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {user ? 'Quick access to your tools and library.' : 'You need to sign in to view your dashboard.'}
        </p>
        {message && <div className="mt-2 text-sm text-purple-200">{message}</div>}
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 pb-16">
        {!loading && !user && (
          <div className="text-center">
            <Link href="/auth" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold">
              Go to Login / Signup
            </Link>
          </div>
        )}

        {!loading && user && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Cheat Sheets</h3>
              <p className="text-gray-300 mb-4">Browse quick references by category and copy snippets instantly.</p>
              <button
                onClick={() => router.push('/notes')}
                className="px-4 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
              >
                Open Cheat Sheets
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Library</h3>
              <p className="text-gray-300 mb-4">Upload, view, download, and manage your files stored on the server.</p>
              <button
                onClick={() => router.push('/library')}
                className="px-4 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
              >
                Open Library
              </button>
            </motion.div>
          </div>
        )}

        {!loading && user && (
          <div className="text-center mt-10">
            <button onClick={signOut} className="px-4 py-2 rounded-lg border border-white/20 hover:border-pink-400/50 text-gray-200 hover:text-white">
              Sign out
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
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
        <a href="https://www.instagram.com/codewithraheem" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" 
            alt="Instagram" 
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
