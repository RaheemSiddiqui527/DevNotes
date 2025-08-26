"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLibrary() {
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Admin gating
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
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
    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    return !!(me?.email && admins.includes(String(me.email).toLowerCase()))
  }, [me])

  useEffect(() => {
    if (!authLoading) {
      if (!me) router.replace("/auth")
      else if (!isAdmin) router.replace("/dashboard")
    }
  }, [authLoading, me, isAdmin, router])

  const [files, setFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterOwner, setFilterOwner] = useState("all")
  const [sortBy, setSortBy] = useState("modified")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [uploading, setUploading] = useState(false)

  const refreshFiles = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/files?scope=all", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch files")
      const mapped = (data.files || []).map((f) => {
        const ext = (f.name.split(".").pop() || "").toLowerCase()
        return {
          id: f.id,
          name: f.name,
          type: ext || (f.type || "").split("/").pop() || "file",
          size: f.size || 0,
          owner: "unknown",
          folder: f.folder || "Root",
          folderId: f.folder ? f.folder : "Root",
          uploadDate: f.createdAt,
          modified: f.createdAt,
          downloads: 0,
          isPublic: false,
          tags: [],
        }
      })
      setFiles(mapped)
      const folderMap = new Map()
      mapped.forEach((file) => {
        const key = file.folder || "Root"
        const prev =
          folderMap.get(key) || { id: key, name: key, fileCount: 0, size: 0 }
        prev.fileCount += 1
        prev.size += file.size || 0
        folderMap.set(key, prev)
      })
      setFolders(Array.from(folderMap.values()))
    } catch (e) {
      setFiles([])
      setFolders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) refreshFiles()
  }, [isAdmin])

  // === Helper functions ===
  const filteredFiles = useMemo(() => {
    let filtered = files.filter((file) => {
      const matchesFolder = currentFolder
        ? file.folderId === currentFolder.id
        : true
      const matchesSearch =
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      const matchesType = filterType === "all" || file.type === filterType
      const matchesOwner =
        filterOwner === "all" || file.owner === filterOwner
      return matchesFolder && matchesSearch && matchesType && matchesOwner
    })

    filtered.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case "name":
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case "size":
          aVal = a.size
          bVal = b.size
          break
        case "owner":
          aVal = a.owner.toLowerCase()
          bVal = b.owner.toLowerCase()
          break
        case "modified":
          aVal = new Date(a.modified)
          bVal = new Date(b.modified)
          break
        case "downloads":
          aVal = a.downloads
          bVal = b.downloads
          break
        default:
          return 0
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [files, currentFolder, searchTerm, filterType, filterOwner, sortBy, sortOrder])

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prev) => {
      const newSelected = prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
      setShowBulkActions(newSelected.length > 0)
      return newSelected
    })
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
      setShowBulkActions(false)
    } else {
      const allIds = filteredFiles.map((file) => file.id)
      setSelectedFiles(allIds)
      setShowBulkActions(true)
    }
  }

  const uniqueOwners = useMemo(
    () => Array.from(new Set(files.map((f) => f.owner))).filter(Boolean),
    [files]
  )
  const uniqueTypes = useMemo(
    () => Array.from(new Set(files.map((f) => f.type))).filter(Boolean),
    [files]
  )

  const onDelete = async (id) => {
    try {
      const res = await fetch(`/api/files?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id))
        setSelectedFiles((prev) => prev.filter((sid) => sid !== id))
      }
    } catch (_) {}
  }

  const onDownload = async (id, name) => {
    try {
      const a = document.createElement("a")
      a.href = `/api/files?id=${encodeURIComponent(id)}&download=1`
      a.download = name || "download"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (_) {}
  }

  // === Upload handler ===
  const inputId = "admin-upload-input"
  const triggerUpload = () => {
    const el = document.getElementById(inputId)
    if (el) el.click()
  }

  const onUpload = async (e) => {
    const filesSel = Array.from(e.target.files || [])
    if (!filesSel.length) return
    setUploading(true)
    try {
      const fd = new FormData()
      filesSel.forEach((f) => fd.append("file", f))
      const res = await fetch("/api/files", { method: "POST", body: fd })
      await res.json().catch(() => ({}))
      if (res.ok) {
        await refreshFiles()
        setUploadModalOpen(false)
      }
    } catch (_) {
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  // === Loading state ===
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading Library...</p>
        </motion.div>
      </div>
    )
  }

  // === Main return ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                File Library
              </h1>
              <p className="text-gray-300 mt-1">
                {currentFolder
                  ? `${currentFolder.name} folder`
                  : "All files"}{" "}
                • {filteredFiles.length} items
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                Upload Files
              </button>
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        {currentFolder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <button
                onClick={() => setCurrentFolder(null)}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-white">{currentFolder.name}</span>
            </nav>
          </motion.div>
        )}

        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Owners</option>
                  {uniqueOwners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sb, so] = e.target.value.split("-")
                    setSortBy(sb)
                    setSortOrder(so)
                  }}
                  className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="modified-desc">Latest Modified</option>
                  <option value="modified-asc">Oldest Modified</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="size-desc">Largest First</option>
                  <option value="size-asc">Smallest First</option>
                  <option value="downloads-desc">Most Downloaded</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {selectedFiles.length === filteredFiles.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {showBulkActions && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-sm text-gray-300">
                      {selectedFiles.length} selected
                    </span>
                    <button
                      className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                      onClick={async () => {
                        await Promise.all(selectedFiles.map((id) => onDelete(id)))
                        setSelectedFiles([])
                        setShowBulkActions(false)
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                      onClick={async () => {
                        selectedFiles.forEach((id) => {
                          const f = files.find((ff) => ff.id === id)
                          if (f) onDownload(id, f.name)
                        })
                      }}
                    >
                      Download
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Folders section */}
        {!currentFolder && folders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <motion.div
                  key={folder.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentFolder(folder)}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/50"
                >
                  <h3 className="text-lg font-medium text-white">
                    {folder.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {folder.fileCount} files
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TODO: File grid/list rendering */}
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
