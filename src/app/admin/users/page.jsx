"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminUsers() {
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

  // Mock user data - replace with actual API call
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin", status: "active", lastLogin: "2024-01-15T10:30:00Z", created: "2024-01-01T00:00:00Z", avatar: null, loginCount: 45, filesUploaded: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", lastLogin: "2024-01-14T15:45:00Z", created: "2024-01-03T00:00:00Z", avatar: null, loginCount: 23, filesUploaded: 8 },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "user", status: "inactive", lastLogin: "2024-01-10T09:15:00Z", created: "2024-01-05T00:00:00Z", avatar: null, loginCount: 12, filesUploaded: 3 },
    { id: 4, name: "Sarah Davis", email: "sarah@example.com", role: "moderator", status: "active", lastLogin: "2024-01-15T12:20:00Z", created: "2024-01-02T00:00:00Z", avatar: null, loginCount: 67, filesUploaded: 25 },
    { id: 5, name: "Tom Brown", email: "tom@example.com", role: "user", status: "suspended", lastLogin: "2024-01-08T14:30:00Z", created: "2024-01-07T00:00:00Z", avatar: null, loginCount: 5, filesUploaded: 1 },
  ]

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("created")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    // Simulate API call
    const t = setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === "all" || user.role === filterRole
      const matchesStatus = filterStatus === "all" || user.status === filterStatus
      return matchesSearch && matchesRole && matchesStatus
    })

    filtered.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break
        case "email": aVal = a.email.toLowerCase(); bVal = b.email.toLowerCase(); break
        case "role": aVal = a.role; bVal = b.role; break
        case "status": aVal = a.status; bVal = b.status; break
        case "lastLogin": aVal = new Date(a.lastLogin); bVal = new Date(b.lastLogin); break
        case "created": aVal = new Date(a.created); bVal = new Date(b.created); break
        default: return 0
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder])

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      const newSelected = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
      setShowBulkActions(newSelected.length > 0)
      return newSelected
    })
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredAndSortedUsers.length) {
      setSelectedUsers([])
      setShowBulkActions(false)
    } else {
      const allIds = filteredAndSortedUsers.map(user => user.id)
      setSelectedUsers(allIds)
      setShowBulkActions(true)
    }
  }

  const handleBulkAction = async (action) => {
    setActionLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Update users based on action
      setUsers(prev => prev.map(user => {
        if (selectedUsers.includes(user.id)) {
          switch (action) {
            case "activate": return { ...user, status: "active" }
            case "deactivate": return { ...user, status: "inactive" }
            case "suspend": return { ...user, status: "suspended" }
            case "delete": return null
            default: return user
          }
        }
        return user
      }).filter(Boolean))
      setSelectedUsers([])
      setShowBulkActions(false)
    } catch (error) {
      console.error("Bulk action failed:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "moderator": return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "user": return "bg-green-500/20 text-green-300 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30"
      case "inactive": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "suspended": return "bg-red-500/20 text-red-300 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading users...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Back to Admin
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">User Management</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header & Stats */}
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Users ({filteredAndSortedUsers.length})</h2>
              <p className="text-gray-400">Manage user accounts and permissions</p>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                Add User
              </div>
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Users", value: users.length },
              { label: "Active", value: users.filter(u => u.status === "active").length },
              { label: "Admins", value: users.filter(u => u.role === "admin").length },
              { label: "This Month", value: users.filter(u => new Date(u.created).getMonth() === new Date().getMonth()).length },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Filters & Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Sort by:</span>
            {["name", "email", "role", "status", "lastLogin", "created"].map((field) => (
              <button
                key={field}
                onClick={() => {
                  if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  else { setSortBy(field); setSortOrder("desc") }
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${sortBy === field ? "bg-purple-600 text-white" : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"}`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortBy === field && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-300">{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction("activate")} disabled={actionLoading} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50">Activate</button>
                  <button onClick={() => handleBulkAction("deactivate")} disabled={actionLoading} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50">Deactivate</button>
                  <button onClick={() => handleBulkAction("suspend")} disabled={actionLoading} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50">Suspend</button>
                  <button onClick={() => handleBulkAction("delete")} disabled={actionLoading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50">Delete</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-left">
                    <input type="checkbox" checked={selectedUsers.length === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0} onChange={handleSelectAll} className="w-4 h-4 text-purple-500 bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-purple-500" />
                  </th>
                  <th className="p-4 text-left text-gray-300 font-medium">User</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Role</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Last Login</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Stats</th>
                  <th className="p-4 text-left text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user, index) => (
                  <motion.tr key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleUserSelect(user.id)} className="w-4 h-4 text-purple-500 bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-purple-500" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>{user.role.toUpperCase()}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>{user.status.toUpperCase()}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-300">{formatDate(user.lastLogin)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400">
                        <div>{user.loginCount} logins</div>
                        <div>{user.filesUploaded} files</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4 text-gray-400 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Delete">
                          <svg className="w-4 h-4 text-red-400 hover:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredAndSortedUsers.map((user, index) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleUserSelect(user.id)} className="w-4 h-4 text-purple-500 bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-purple-500" />
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Role</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>{user.role.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Status</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>{user.status.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Last Login</div>
                    <div className="text-gray-300 text-xs">{formatDate(user.lastLogin)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Activity</div>
                    <div className="text-gray-300 text-xs">{user.loginCount} logins • {user.filesUploaded} files</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredAndSortedUsers.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
