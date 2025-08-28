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
    "C#": "🟦",
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
    "React Patterns": "⚛️",
    Flutter: "🦋",
    Dart: "🎯",
    Kotlin: "🧬",
    PostgreSQL: "🐘",
    Redis: "🧠",
    Kubernetes: "☸️",

    // New languages
    Swift: "🍎",
    C: "📘",
    "C++": "➕",
    R: "📊",
    Julia: "🔢",
    Perl: "🧵",
    Haskell: "λ",
    Elixir: "💧",
    Erlang: "🧪",
    MATLAB: "📐",
    SAS: "📑",
    Assembly: "⚙️",
  }

  const icon = iconMap[title] || "📘"
  if (icon) {
    return <span aria-hidden="true" className="text-xl">{icon}</span>
  }
}

// logoFor: Simple Icons
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
    PHP: "php",
    Ruby: "ruby",
    Scala: "scala",
    Go: "go",
    Rust: "rust",
    SQL: "postgresql",
    Docker: "docker",
    MongoDB: "mongodb",
    "Bash / Shell": "gnubash",
    "HTTP Status Codes": "httpie",
    "Git Essentials": "git",
    "NPM / Yarn": "npm",
    "Next.js Data Fetching": "nextdotjs",
    "React Patterns": "react",
    Flutter: "flutter",
    Dart: "dart",
    Kotlin: "kotlin",
    PostgreSQL: "postgresql",
    Redis: "redis",
    Kubernetes: "kubernetes",

    // New languages logos
    Swift: "swift",
    C: "c",
    "C++": "cplusplus",
    R: "r",
    Julia: "julia",
    Perl: "perl",
    Haskell: "haskell",
    Elixir: "elixir",
    Erlang: "erlang",
    MATLAB: "matlab",
    SAS: "sas",
    Assembly: "gnuemacs",
  }

  const slug = map[title]
  if (slug) return `https://cdn.simpleicons.org/${slug}`
  return null
}

const categoryDescriptions = {
  "Git Essentials": "Core git commands for daily workflows.",
  "NPM / Yarn": "Package management and running project scripts.",
  "Next.js Data Fetching": "Server-side rendering (SSR) and static site generation (SSG).",
  "React Patterns": "Reusable patterns, hooks, and optimizations for React.",
  "Bash / Shell": "Command line utilities and shell scripting essentials.",
  Docker: "Containers, images, volumes, and networking basics.",
  Kubernetes: "Pod orchestration, deployments, services, and scaling apps.",
  MongoDB: "NoSQL database with flexible schemas and common queries.",
  "HTTP Status Codes": "Standard responses with meaning (2xx, 3xx, 4xx, 5xx).",
  "Regex Quickies": "Commonly used regular expressions for string patterns.",
  JavaScript: "Core language constructs, ES6+ features, and browser APIs.",
  TypeScript: "Strong typing, interfaces, generics, and advanced language utilities.",
  Python: "General-purpose language for scripting, ML, and automation.",
  Rust: "Safe systems programming with ownership, lifetimes, and concurrency.",
  Java: "Object-oriented programming and JVM ecosystem.",
  "C#": "Modern cross-platform .NET language features.",
  PHP: "Web scripting, Laravel/Symfony frameworks, and backend basics.",
  Kotlin: "Concise modern language, primarily for Android apps.",
  Scala: "Functional and object-oriented programming on JVM.",
  Dart: "Language designed for Flutter with async and reactive patterns.",
  Go: "Fast, lightweight concurrency with goroutines and channels.",
  Flutter: "Cross-platform UI toolkit using Dart.",
  PostgreSQL: "Relational database with advanced SQL features and indexing.",
  Redis: "In-memory store for caching, queues, and pub/sub.",
  "Web & Frontend": "HTML, CSS, and frontend development utilities.",
  "Backend & APIs": "Frameworks and tools for building backend services.",
  Mobile: "Kotlin, Swift, Flutter and cross-platform app snippets.",
  "Data & Machine Learning": "R, Julia, Python, and ML/AI utilities.",
  "Systems & Scripting": "C, C++, Bash, and low-level programming.",
  "DevOps / Infra": "CI/CD, Terraform, Kubernetes, and infrastructure as code.",
  "Security / Blockchain": "Cryptography, smart contracts, and blockchain basics.",

  // New descriptions
  Swift: "Language for iOS, macOS, watchOS, and tvOS apps.",
  C: "Low-level programming language close to hardware.",
  "C++": "Extension of C with object-oriented features and high performance.",
  R: "Statistical computing and data visualization.",
  Julia: "High-performance language for numerical and scientific computing.",
  Perl: "Practical language for text manipulation and scripting.",
  Haskell: "Pure functional programming with strong type system.",
  Elixir: "Scalable functional programming built on Erlang VM.",
  Erlang: "Distributed, fault-tolerant systems programming.",
  MATLAB: "Numerical computing and data visualization platform.",
  SAS: "Statistical analysis and business intelligence.",
  Assembly: "Low-level language for direct hardware control.",
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
          <Link 
  href="/" 
  className="flex items-center gap-2 text-sm md:text-base text-gray-300 font-medium px-4 py-2 rounded-full border border-transparent hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 hover:scale-105"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
  Back to Home
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
          className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4"
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
        
        {/* ✅ Info Card for Selected Category */}
        {selectedCategory && selectedCategory === section.title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 sm:p-6 bg-white/10 border border-white/20 rounded-xl shadow-md text-center"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              {logoFor(selectedCategory) ? (
                <img
                  src={logoFor(selectedCategory)}
                  alt={`${selectedCategory} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              ) : (
                <div className="text-3xl">{iconFor(selectedCategory)}</div>
              )}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-purple-200">
                  {selectedCategory}
                </h2>
                <p className="text-sm text-gray-300">
                  {categoryDescriptions[selectedCategory] ||
                    "Snippets and examples for this category."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ✅ Snippets Grid */}
        <main className="container mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {section.items.map((item, iIdx) => {
              const key = `${sIdx}-${iIdx}-${item.label}`
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 shadow-md hover:border-purple-400/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-purple-200">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.code, key)}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
                    >
                      {copiedKey === key ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* ✅ Code Block */}
                  <pre className="mt-3 p-3 bg-black/40 rounded text-xs sm:text-sm overflow-x-auto whitespace-pre max-w-full">
                    {item.code}
                  </pre>
                </motion.div>
              )
            })}
          </div>
        </main>
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
