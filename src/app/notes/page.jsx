"use client"
import { useMemo, useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link";

const icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm font-medium">Loading resources...</p>
          </div>
        </div>
      }
    >
      <NotesCheatSheet />
    </Suspense>
  )
}

function NotesCheatSheet() {
  const [query, setQuery] = useState("")
  const [copiedKey, setCopiedKey] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sections, setSections] = useState([])
  const [error, setError] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const searchInputRef = useMemo(() => ({ current: null }), [])

  useEffect(() => {
    const handleEvents = (e) => {
      if (e.type === 'mousemove') {
        setMousePosition({ x: e.clientX, y: e.clientY })
      } else if (e.type === 'keydown' && (e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('mousemove', handleEvents)
    window.addEventListener('keydown', handleEvents)
    return () => {
      window.removeEventListener('mousemove', handleEvents)
      window.removeEventListener('keydown', handleEvents)
    }
  }, [searchInputRef])

  useEffect(() => {
    async function loadCheatSheet() {
      try {
        const response = await fetch('/notes/data/cheatsheet.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSections(data);
      } catch (err) {
        console.error("Error loading JSON:", err);
        setError("Failed to load cheat sheet resources.");
      }
    }
    loadCheatSheet();
  }, []);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    let base = sections
    if (selectedCategory) {
      base = sections.filter((s) => s.title === selectedCategory)
    }
    if (!q) return base
    return base
      .map((s) => ({
        ...s,
        items: s.items.filter((i) =>
          [s.title, i.label, i.code, (i.desc || '')].some((t) => t.toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.items.length > 0)
  }, [query, sections, selectedCategory])

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch (e) {
      console.error("Failed to copy:", e)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center p-6">
        <div className="min-card p-12 text-center max-w-md">
          <h1 className="text-xl font-bold mb-2 text-white">System Error</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/" className="text-accent text-sm font-bold hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent/30 overflow-hidden relative">
      <div className="fixed inset-0 dot-pattern opacity-40 z-0 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                {icons.back}
              </div>
              <span className="text-sm font-medium">Back</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded object-contain" />
              <span className="text-sm font-bold text-white tracking-tight">DevNotes</span>
            </div>

            <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">Cheat Sheets</div>
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <header className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
          >
            Quick <span className="text-gray-500">References.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-12"
          >
            Instant access to developer commands and snippets. Offline-first and private.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">
              {icons.search}
            </div>
            <input
              ref={(el) => (searchInputRef.current = el)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (e.g. git push, react hook, docker)..."
              className="w-full pl-14 pr-6 py-5 bg-background/50 border border-border-subtle rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors shadow-2xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 border border-border-subtle rounded-lg text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">
              ⌘K
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-24 relative z-10">
        {sections.length === 0 && (
          <div className="text-center py-24">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          </div>
        )}

        {/* Categories Browser */}
        {!selectedCategory && !query && sections.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sections.map((section, idx) => (
              <motion.button
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCategory(section.title)}
                className="min-card p-6 flex flex-col items-center justify-center group hover:border-accent/50 transition-colors"
              >
                <div className="text-lg font-bold text-white mb-1">{section.title}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                  {section.items.length} Snippets
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Snippets List */}
        {(selectedCategory || query) && (
          <div className="max-w-5xl mx-auto space-y-16">
            {selectedCategory && (
              <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold text-white tracking-tight">{selectedCategory}</h2>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/20">
                    {filteredSections[0]?.items.length || 0} ITEMS
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-white text-sm font-bold transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}

            {filteredSections.length === 0 ? (
              <div className="text-center py-24 text-gray-500 italic">No results matching "{query}"</div>
            ) : (
              <div className="space-y-12">
                {filteredSections.map((section, sIdx) => (
                  <div key={section.title} className="space-y-6">
                    {!selectedCategory && (
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-l-2 border-accent pl-4">
                        {section.title}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.items.map((item, iIdx) => {
                        const key = `${sIdx}-${iIdx}`
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className="min-card p-6 flex flex-col subtle-glow group"
                          >
                            <div className="flex items-start justify-between mb-4 gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-accent transition-colors truncate">
                                  {item.label}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                  {item.desc}
                                </p>
                              </div>
                              <button
                                onClick={() => handleCopy(item.code, key)}
                                className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                  copiedKey === key 
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white hover:text-black hover:border-white'
                                }`}
                              >
                                {copiedKey === key ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <div className="relative mt-auto">
                              <pre className="bg-black/40 rounded-xl p-4 text-[13px] font-mono text-gray-400 overflow-x-auto border border-white/5 group-hover:border-white/10 transition-colors">
                                <code>{item.code}</code>
                              </pre>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Compact Footer */}
      <footer className="border-t border-border-subtle bg-background/50 relative z-10 py-12">
        <div className="container mx-auto px-6 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          DevNotes • Professional Code Discovery
        </div>
      </footer>
    </div>
  )
}