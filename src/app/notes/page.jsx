"use client"
import { useMemo, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
          Loading…
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

  const router = useRouter()
  const searchParams = useSearchParams()

  // Load JSON data and handle category from URL
  useEffect(() => {
    async function loadCheatSheet() {
      try {
        const response = await fetch("/notes/data/cheatsheet.json")
        if (!response.ok) {
          throw new Error("Failed to fetch cheat sheet data")
        }
        const data = await response.json()
        setSections(data)
      } catch (err) {
        console.error("Error loading JSON:", err)
        setError("Failed to load cheat sheet. Please check the JSON file for syntax errors.")
      }
    }
    loadCheatSheet()

    const cat = searchParams.get("cat")
    setSelectedCategory(cat || null)
  }, [searchParams])

const iconFor = (title) => {
  const iconMap = {
    "Web & Frontend": "🌐",
    "Backend & APIs": "⚙️",
    Mobile: "📱",
    "Data & Machine Learning": "📊",
    "Systems & Scripting": "🐧",
    "DevOps / Infra": "☁️",
    "Security / Blockchain": "🛡️",
    JavaScript: "🟨",
    TypeScript: "🔷",
    Python: "🐍",
    Java: "☕", 
    "C#":"C#",       // better C# icon
    PHP: "🐘",
    Ruby: "💎",
    Scala: "🔺",
    Go: "🐹",
    Rust: "🦀",
    SQL: "🗄️",
    Docker: "🐳",
    MongoDB: "🍃",
    "Bash / Shell": "💻",
    "Regex Quickies": "#️",
    "HTTP Status Codes": "📄",
    "Git Essentials": "🌿",
    "NPM / Yarn": "📦",
    "Next.js Data Fetching": "⚡",
    "Flutter": "🦋",
    "React Patterns": "⚛️",
    "Dart": "🎯",
   
  }
  return <span aria-hidden="true" className="text-xl">{iconMap[title] || "📘"}</span>
}

const logoFor = (title) => {
  const map = {
    "Web & Frontend": "html5",
    "Backend & APIs": "nodedotjs",
    Mobile: "android",
    "Data & Machine Learning": "tensorflow",
    "Systems & Scripting": "linux",
    "DevOps / Infra": "kubernetes",
    "Security / Blockchain": "solidity",
    JavaScript: "javascript",
    TypeScript: "typescript",
    Python: "python",
    Java: "openjdk",
    "C#": "csharp",
    PHP: "php",
    Ruby: "ruby",
    Scala: "scala",
    Go: "go",
    Rust: "rust",
    SQL: "postgresql",
    Docker: "docker",
    MongoDB: "mongodb",
    "Bash / Shell": "gnubash",
    "Regex Quickies": null,
    "HTTP Status Codes": "httpie",
    "Git Essentials": "git",
    "NPM / Yarn": "npm",
    "Next.js Data Fetching": "nextdotjs",
    "React Patterns": "react",
    "Flutter": "flutter",
    "Dart": "Dart",
   
  }
  const slug = map[title]
  return slug ? `https://cdn.simpleicons.org/${slug}` : null
}

const categoryDescriptions = {
  "Git Essentials": "Core git commands for daily workflows.",
  "NPM / Yarn": "Package management and scripts.",
  "Next.js Data Fetching": "Build-time and server-side data fetching.",
  "React Patterns": "Common hooks and patterns.",
  "Bash / Shell": "CLI commands for productivity.",
  Docker: "Containers, images, and commands.",
  MongoDB: "Connection strings and queries.",
  "HTTP Status Codes": "Common responses and meanings.",
  "Regex Quickies": "Useful regular expressions.",
  JavaScript: "Language essentials and idioms.",
  TypeScript: "Types, interfaces, and generics.",
  Python: "Syntax and common utilities.",
  Java: "Core language constructs.",
  "C#": "Modern C# features.",
  PHP: "Language basics and frameworks.",
  Ruby: "Ruby idioms and Rails snippets.",
  Scala: "Functional programming examples.",
  Go: "Goroutines and channels.",
  Rust: "Ownership, result/option basics.",
  SQL: "DDL and DML cheats.",
  "Web & Frontend": "UI, HTML5, CSS, TS and tooling.",
  "Backend & APIs": "Servers and API frameworks.",
  Mobile: "Kotlin, Swift, Flutter basics.",
  "Data & Machine Learning": "R, Julia, MATLAB snippets.",
  "Systems & Scripting": "C/C++, Bash, Assembly.",
  "DevOps / Infra": "K8s, Terraform, Ansible.",
  "Security / Blockchain": "Solidity and Move basics.",
  "Dart": "Flutter and server-side Dart.",
  "Flutter": "Widgets, state management.",
}


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
        items: s.items.filter((i) => [s.title, i.label, i.code, i.desc].some((t) => t.toLowerCase().includes(q))),
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error Loading Cheat Sheet</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
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
              Notes & Cheat Sheet
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
          Quick References for Daily Dev Work
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Searchable snippets, and a local library for your PDFs/EPUBs. Files are stored only in your browser
          (IndexedDB).
        </p>
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cheat sheet (e.g. git push, getStaticProps, docker run)"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
              aria-label="Search cheat sheet"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* Content */}
     <main className="container mx-auto px-4 sm:px-6 pb-16">
  {sections.length === 0 && !error && (
    <div className="text-center text-gray-400 py-16">Loading cheat sheet...</div>
  )}

  {/* Category Cards */}
  {!selectedCategory && !query && sections.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
      {sections.map((s) => (
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="cursor-pointer group"
            style={{ perspective: 1000 }}
            onClick={() => {
              setSelectedCategory(s.title)
              router.push(`/notes?cat=${encodeURIComponent(s.title)}`)
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedCategory(s.title)
                router.push(`/notes?cat=${encodeURIComponent(s.title)}`)
              }
            }}
          >
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full aspect-square"
            >
              <div
                className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-purple-400/40 transition-colors"
                style={{ backfaceVisibility: "hidden" }}
              >
                {logoFor(s.title) ? (
                  <img
                    src={logoFor(s.title)}
                    alt={`${s.title} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow"
                  />
                ) : (
                  <div className="text-4xl">{iconFor(s.title)}</div>
                )}
                <div className="text-center">
                  <h3 className="font-semibold text-purple-200">{s.title}</h3>
                  <div className="text-xs text-gray-300 mt-1">
                    {Array.isArray(s.items) ? `${s.items.length} items` : "0 items"}
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-center text-center hover:border-purple-400/40 transition-colors"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div>
                  <div className="text-sm text-gray-200 mb-2">
                    {categoryDescriptions[s.title] || "Open to view snippets."}
                  </div>
                  <div className="text-xs text-gray-400">Click or press Enter to open</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )}

  {(selectedCategory || query) && (
    <>
      {selectedCategory && (
        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedCategory(null)
              router.push("/notes")
            }}
            className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
            aria-label="Return to all categories"
          >
            ← All Categories
          </button>
        </div>
      )}
      {filteredSections.length === 0 && (
        <div className="text-center text-gray-400 py-16">No matches found.</div>
      )}
    </>
  )}

  {(selectedCategory || query) && filteredSections.length > 0 && (
    <div className="space-y-10">
      {filteredSections.map((section, sIdx) => (
        <section key={section.title}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            <span className="inline-flex items-center gap-2">
              {logoFor(section.title) ? (
                <img
                  src={logoFor(section.title)}
                  alt={`${section.title} logo`}
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain inline-block align-middle"
                />
              ) : (
                iconFor(section.title)
              )}
              <span>{section.title}</span>
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(section.items) &&
              section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}-${item.label}`
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:border-purple-400/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-purple-200">{item.label}</h3>
                        <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(item.code, key)}
                        className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
                        aria-label={`Copy ${item.label} code`}
                      >
                        {copiedKey === key ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="mt-3 p-3 bg-black/40 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words sm:whitespace-pre">
                      {item.code}
                    </pre>
                  </motion.div>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )}
</main>


      {/* Footer */}
      <footer className="bg-black/50 py-8 border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-300 font-medium">
            DevNotes • Developer Cheat Sheets <br className="md:hidden" />
            <span className="text-sm text-gray-400">by CodeWithRaheem</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-gray-400 text-sm">Updated regularly • Copy & use safely</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a
                href="https://github.com/RaheemSiddiqui527"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg"
                  alt="GitHub"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a
                href="https://twitter.com/codewithraheem"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter profile"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg"
                  alt="Twitter"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/codewithraheem"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
                  alt="LinkedIn"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a
                href="https://www.instagram.com/codewithraheem"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
              >
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
