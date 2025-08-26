"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const isLogin = mode === "login"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [user, setUser] = useState(null)
  const router = useRouter()

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      setUser(data.user)
    } catch (_) {
      setUser(null)
    }
  }
  useEffect(() => { fetchMe() }, [])
  useEffect(() => {
    if (user) {
      const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      const isAdmin = !!(user?.email && admins.includes(String(user.email).toLowerCase()))
      router.replace(isAdmin ? '/admin' : '/dashboard')
    }
  }, [user, router])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    const form = new FormData(e.currentTarget)
    const name = form.get('name')?.toString().trim()
    const email = form.get('email')?.toString().trim()
    const password = form.get('password')?.toString()
    const confirm = form.get('confirm')?.toString()

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill all required fields')
      return
    }
    if (!isLogin && password !== confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(isLogin ? '/api/auth/login' : '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Request failed')
        return
      }
      setMessage(isLogin ? 'Logged in successfully' : 'Account created')
      setUser(data.user)
      e.currentTarget.reset()
    } catch (_) {
      setError('Network error')
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(""), 2500)
    }
  }

  const onLogout = async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setMessage('Logged out')
    } catch (_) {
      // ignore
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(""), 2000)
    }
  }

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
              Get Started
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
        >
          {user ? `Welcome, ${user.name || user.email}` : (isLogin ? "Welcome back" : "Create your account")}
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {user ? "You are signed in." : (isLogin ? "Log in to access your notes and library." : "Sign up to personalize your cheat sheets and library.")}
        </p>
      </header>

      {/* Auth Card */}
      <section className="container mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
        >
          {/* Signed in state */}
          {user && (
            <div className="mb-6 text-center">
              <div className="text-purple-200 font-medium">Signed in as {user.name || user.email}</div>
              <div className="mt-3">
                <button onClick={onLogout} className="px-4 py-2 rounded-lg border border-white/20 hover:border-pink-400/50 text-gray-200 hover:text-white" disabled={loading}>
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          {!user && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-2 rounded-lg border transition-colors ${isLogin ? "border-purple-400/50 text-white" : "border-white/20 text-gray-300 hover:border-purple-400/40"}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-4 py-2 rounded-lg border transition-colors ${!isLogin ? "border-pink-400/50 text-white" : "border-white/20 text-gray-300 hover:border-pink-400/40"}`}
            >
              Sign Up
            </button>
          </div>
          )}

          {/* Alerts */}
          {error && <div className="mb-4 text-sm text-red-300">{error}</div>}
          {message && <div className="mb-4 text-sm text-green-300">{message}</div>}

          {/* Social */}
          {!user && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="px-3 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white" disabled={loading}>Google</button>
            <button className="px-3 py-2 rounded-lg border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white" disabled={loading}>GitHub</button>
          </div>
          )}

          {/* Form */}
          {!user && (
          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
                <input
                  name="confirm"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold disabled:opacity-60"
            >
              {loading ? 'Please wait...' : (isLogin ? "Log In" : "Create Account")}
            </button>
          </form>
          )}
        </motion.div>
      </section>

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
