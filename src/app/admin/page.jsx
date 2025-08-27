"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDashboard() {
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [quickActions, setQuickActions] = useState([])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setMe(data.user)
      } catch (_) {
        setMe(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const isAdmin = useMemo(() => {
    const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    return !!(me?.email && emails.includes(String(me.email).toLowerCase()))
  }, [me])

  useEffect(() => {
    if (!loading) {
      if (!me) router.replace('/auth')
      else if (!isAdmin) router.replace('/dashboard')
    }
  }, [loading, me, isAdmin, router])

  const actions = [
    {
      title: "User Management",
      description: "View, promote, or remove users with advanced filtering.",
      category: "Users",
      priority: "high",
      icon: (
        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      link: "/admin/users",
      badge: "Active",
      shortcuts: ["Ctrl+U"],
    },
    {
      title: "Library",
      description: "Upload, view, and manage files with bulk operations.",
      category: "Content",
      priority: "high",
      icon: (
        <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5V6a2 2 0 012-2h10"/>
          <path d="M20 8H8a2 2 0 00-2 2v9.5"/>
          <path d="M16 6v14"/>
        </svg>
      ),
      link: "/admin/library",
      badge: "Updated",
      shortcuts: ["Ctrl+L"],
    },
    {
      title: "Cheat Sheets",
      description: "Create and manage quick reference guides and documentation.",
      category: "Content",
      priority: "medium",
      icon: (
        <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v16H4z"/>
          <path d="M8 8h8M8 12h6M8 16h4"/>
        </svg>
      ),
      link: "/admin/cheatsheets",
      badge: null,
      shortcuts: ["Ctrl+C"],
    },
    {
      title: "Analytics",
      description: "View detailed analytics, user behavior, and system metrics.",
      category: "Monitoring",
      priority: "medium",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M9 9l4-4 3 3 4-4"/>
          <path d="M7 21l4-4 3 3 4-4"/>
        </svg>
      ),
      link: "/admin/analytics",
      badge: "New",
      shortcuts: ["Ctrl+A"],
    },
    {
      title: "System Logs",
      description: "Track login activity, uploads, and system events in real-time.",
      category: "Monitoring",
      priority: "low",
      icon: (
        <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      link: "/admin/logs",
      badge: null,
      shortcuts: ["Ctrl+Shift+L"],
    },
    {
      title: "Settings",
      description: "Configure system settings, security, and integrations.",
      category: "System",
      priority: "medium",
      icon: (
        <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6 1.65 1.65 0 0010.5 3H11a2 2 0 014 0v.09c0 .66.39 1.26 1 1.51.56.26 1.22.16 1.68-.3l.06-.06a2 2 0 012.83 2.83l-.06.06c-.46.46-.56 1.12-.3 1.68.25.61.85 1 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      ),
      link: "/admin/settings",
      badge: null,
      shortcuts: ["Ctrl+,"],
    },
  ]

  const signOut = async () => {
    try {
      setSigningOut(true)
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/auth')
    } catch (_) {
      router.replace('/auth')
    } finally {
      setSigningOut(false)
    }
  }

  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState("")

  const refreshStats = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) { setStatsError(data.error || 'Failed to load stats'); return }
      setStats(data)
      setStatsError("")
    } catch (_) {
      setStatsError('Network error')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (isAdmin) refreshStats()
  }, [isAdmin])

  // Filter actions based on search
  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group actions by category
  const groupedActions = filteredActions.reduce((groups, action) => {
    const category = action.category
    if (!groups[category]) groups[category] = []
    groups[category].push(action)
    return groups
  }, {})

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const action = actions.find(a => 
          a.shortcuts?.some(shortcut => {
            const keys = shortcut.split('+').slice(-1)[0]
            return keys.toLowerCase() === e.key.toLowerCase()
          })
        )
        if (action && !e.shiftKey) {
          e.preventDefault()
          router.push(action.link)
        } else if (action && e.shiftKey && action.shortcuts?.some(s => s.includes('Shift'))) {
          e.preventDefault()
          router.push(action.link)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading Admin Dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2 text-sm md:text-base text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Home
            </Link>
            
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </motion.div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshStats}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh Stats"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23,4 23,10 17,10"/>
                  <polyline points="1,20 1,14 7,14"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
          >
            <div className="relative max-w-md mx-auto">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search admin tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Enhanced Header */}
      <header className="container mx-auto px-4 sm:px-6 pt-10 pb-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
          >
            {loading ? 'Loading…' : `Welcome back${me?.name ? `, ${me.name.split(' ')[0]}` : ''}`}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-lg"
          >
            Manage your system with powerful admin tools and real-time insights.
          </motion.p>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 pb-16">
        {/* Enhanced Stats Grid */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {[
                { label: "Total Users", value: stats?.userCount, icon: "👥", color: "from-blue-500 to-cyan-500" },
                { label: "Files Stored", value: stats?.fileCount, icon: "📁", color: "from-green-500 to-emerald-500" },
                { label: "Today's Logins", value: stats?.loginLast24h, icon: "🔐", color: "from-purple-500 to-pink-500" },
                { label: "System Status", value: statsError ? "Error" : "Healthy", icon: statsError ? "⚠️" : "✅", color: statsError ? "from-red-500 to-orange-500" : "from-cyan-500 to-blue-500" }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 group hover:scale-105 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                      {refreshing && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mb-1">{stat.label}</div>
                    <div className="text-3xl font-bold">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : (stat.value ?? '—')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Activity */}
        <AnimatePresence>
          {isAdmin && stats?.recentUploads?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Live</span>
              </div>
              <div className="space-y-3">
                {stats.recentUploads.map((u, idx) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="flex-1 text-sm">
                      <span className="text-purple-300 font-medium">{u.email}</span>
                      <span className="text-gray-300"> uploaded </span>
                      <span className="text-cyan-300 font-medium">{u.count} file{u.count !== 1 ? 's' : ''}</span>
                      {u.folder && <span className="text-gray-300"> to <span className="text-orange-300">{u.folder}</span></span>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(u.when).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Action Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {Object.entries(groupedActions).map(([category, categoryActions]) => (
            <motion.div key={category} variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryActions.map((action, idx) => (
                  <motion.div
                    key={action.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Priority indicator */}
                    {action.priority === 'high' && (
                      <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Badge */}
                    {action.badge && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          action.badge === 'New' ? 'bg-green-500/20 text-green-300' :
                          action.badge === 'Updated' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {action.badge}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold group-hover:text-white transition-colors">
                            {action.title}
                          </h3>
                          {action.shortcuts && (
                            <div className="text-xs text-gray-400 mt-1 font-mono">
                              {action.shortcuts.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {action.description}
                      </p>
                      
                      <Link href={action.link} className="block">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                        >
                          Open {action.title}
                        </motion.div>
                      </Link>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No results message */}
        {searchTerm && filteredActions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </motion.div>
        )}

        {/* Enhanced Sign Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            onClick={signOut}
            disabled={signingOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-6 py-3 rounded-xl border border-white/20 hover:border-pink-400/50 text-gray-200 hover:text-white disabled:opacity-60 transition-all duration-300 backdrop-blur-sm bg-white/5 hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              {signingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing out…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </main>

      {/* Enhanced Footer */}
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