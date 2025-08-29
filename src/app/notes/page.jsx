"use client"
import { useMemo, useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link";

// Helper functions moved outside component to avoid redeclaration
const getGradient = (title) => {
  const gradientMap = {
    "Git Essentials": "from-green-600 via-emerald-600 to-teal-600",
    "Docker": "from-blue-600 via-cyan-600 to-blue-800",
    "JavaScript": "from-yellow-500 via-orange-500 to-red-500",
    "TypeScript": "from-blue-500 via-indigo-600 to-purple-600",
    "Python": "from-green-500 via-blue-500 to-purple-600",
    "React": "from-cyan-400 via-blue-500 to-purple-600",
    "Node.js": "from-green-400 via-emerald-500 to-teal-500",
    "MongoDB": "from-green-600 via-green-700 to-green-800",
    "PostgreSQL": "from-blue-400 via-indigo-500 to-blue-600",
    "Redis": "from-red-500 via-red-600 to-red-700",
    "HTML": "from-orange-500 via-red-500 to-pink-500",
    "CSS": "from-blue-400 via-purple-500 to-indigo-600",
    "Vue.js": "from-green-400 via-green-500 to-emerald-600",
    "Angular": "from-red-500 via-red-600 to-red-700",
    "PHP": "from-purple-500 via-indigo-600 to-blue-600",
    "Java": "from-orange-400 via-yellow-500 to-red-500",
    "C++": "from-blue-500 via-purple-600 to-indigo-700",
    "C#": "from-purple-500 via-blue-600 to-indigo-600",
    "Ruby": "from-red-500 via-pink-500 to-red-600",
    "Go": "from-cyan-400 via-blue-500 to-indigo-600",
    "Rust": "from-orange-600 via-red-600 to-orange-700",
    "Swift": "from-orange-400 via-red-500 to-pink-500",
    "Kotlin": "from-purple-500 via-blue-600 to-indigo-600",
    "Flutter": "from-blue-400 via-cyan-500 to-teal-500",
    "Laravel": "from-red-500 via-orange-500 to-yellow-500",
    "Django": "from-green-600 via-emerald-600 to-teal-600",
    "Express.js": "from-gray-600 via-gray-700 to-gray-800",
    "Flask": "from-blue-400 via-indigo-500 to-purple-600",
    "Spring": "from-green-500 via-emerald-600 to-teal-600",
    "AWS": "from-orange-400 via-yellow-500 to-orange-600",
    "Azure": "from-blue-500 via-indigo-600 to-blue-700",
    "Linux": "from-yellow-400 via-orange-500 to-red-500",
    "Bash": "from-gray-600 via-gray-700 to-gray-800",
    "Vim": "from-green-500 via-emerald-600 to-teal-600",
    "VS Code": "from-blue-500 via-indigo-600 to-purple-600",
    "Webpack": "from-blue-400 via-cyan-500 to-teal-500",
    "Jest": "from-red-500 via-pink-500 to-red-600",
    "GraphQL": "from-pink-500 via-purple-500 to-indigo-600",
    "REST API": "from-green-400 via-blue-500 to-purple-600",
    "SQL": "from-blue-500 via-indigo-600 to-purple-600",
    "NoSQL": "from-orange-500 via-red-500 to-pink-500",
    "Kubernetes": "from-blue-600 via-indigo-700 to-purple-700"
  }
  return gradientMap[title] || "from-gray-600 via-gray-700 to-gray-800"
}

const getShadowColor = (title) => {
  const shadowMap = {
    "Git Essentials": "shadow-green-500/20",
    "Docker": "shadow-blue-500/20",
    "JavaScript": "shadow-yellow-500/20",
    "TypeScript": "shadow-blue-500/20",
    "Python": "shadow-purple-500/20",
    "React": "shadow-cyan-500/20",
    "Node.js": "shadow-green-500/20",
    "MongoDB": "shadow-green-500/20",
    "PostgreSQL": "shadow-blue-500/20",
    "Redis": "shadow-red-500/20",
    "HTML": "shadow-orange-500/20",
    "CSS": "shadow-blue-500/20",
    "Vue.js": "shadow-green-500/20",
    "Angular": "shadow-red-500/20",
    "PHP": "shadow-purple-500/20",
    "Java": "shadow-orange-500/20",
    "C++": "shadow-blue-500/20",
    "C#": "shadow-purple-500/20",
    "Ruby": "shadow-red-500/20",
    "Go": "shadow-cyan-500/20",
    "Rust": "shadow-orange-500/20",
    "Swift": "shadow-orange-500/20",
    "Kotlin": "shadow-purple-500/20",
    "Flutter": "shadow-blue-500/20",
    "Laravel": "shadow-red-500/20",
    "Django": "shadow-green-500/20",
    "Express.js": "shadow-gray-500/20",
    "Flask": "shadow-blue-500/20",
    "Spring": "shadow-green-500/20",
    "AWS": "shadow-orange-500/20",
    "Azure": "shadow-blue-500/20",
    "Linux": "shadow-yellow-500/20",
    "Bash": "shadow-gray-500/20",
    "Vim": "shadow-green-500/20",
    "VS Code": "shadow-blue-500/20",
    "Webpack": "shadow-blue-500/20",
    "Jest": "shadow-red-500/20",
    "GraphQL": "shadow-pink-500/20",
    "REST API": "shadow-green-500/20",
    "SQL": "shadow-blue-500/20",
    "NoSQL": "shadow-orange-500/20",
    "Kubernetes": "shadow-blue-500/20"
  }
  return shadowMap[title] || "shadow-gray-500/20"
}

const icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300">Loading DevNotes...</p>
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Load JSON data
useEffect(() => {
  async function loadCheatSheet() {
    try {
      // Correctly fetch the JSON file from the public directory
      const response = await fetch('/notes/data/cheatsheet.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Set the fetched data to the state
      setSections(data);
      
    } catch (err) {
      console.error("Error loading JSON:", err);
      setError("Failed to load cheat sheet. Please check the JSON file and file path.");
    }
  }
  loadCheatSheet();
}, []);

  const iconFor = (title) => {
    const iconMap = {
      "Git Essentials": "🌿",
      "Docker": "🐳", 
      "JavaScript": "🟨",
      "TypeScript": "🔷",
      "Python": "🐍",
      "React": "⚛️",
      "Node.js": "🟢",
      "MongoDB": "🍃",
      "PostgreSQL": "🐘",
      "Redis": "🧠",
      "HTML": "🌐",
      "CSS": "🎨",
      "Vue.js": "💚",
      "Angular": "🅰️",
      "PHP": "🐘",
      "Java": "☕",
      "C++": "⚡",
      "C#": "🔵",
      "Ruby": "💎",
      "Go": "🐹",
      "Rust": "🦀",
      "Swift": "🦅",
      "Kotlin": "🎯",
      "Flutter": "🐦",
      "Laravel": "🔴",
      "Django": "🟩",
      "Express.js": "🚀",
      "Flask": "⚗️",
      "Spring": "🍃",
      "AWS": "☁️",
      "Azure": "🔵",
      "Linux": "🐧",
      "Bash": "💻",
      "Vim": "📝",
      "VS Code": "💙",
      "Webpack": "📦",
      "Jest": "🃏",
      "GraphQL": "🔮",
      "REST API": "🌐",
      "SQL": "📊",
      "NoSQL": "🗄️",
      "Kubernetes": "⚙️"
      // Add more icons for your other languages...
    }
    return iconMap[title] || "📘"
  }

  const categoryDescriptions = {
    "Git Essentials": "Core git commands for daily workflows and version control.",
    "Docker": "Container management, images, and deployment commands.",
    "JavaScript": "Core language features, ES6+ syntax, and common patterns.",
    "TypeScript": "Type annotations, interfaces, and advanced TypeScript features.",
    "Python": "Essential Python syntax, libraries, and development patterns.",
    "React": "Component patterns, hooks, and React best practices.",
    "Node.js": "Server-side JavaScript runtime and package management.",
    "MongoDB": "NoSQL database operations and queries.",
    "PostgreSQL": "Relational database management and SQL operations.",
    "Redis": "In-memory data structure store and caching.",
    "HTML": "Markup language fundamentals and semantic elements.",
    "CSS": "Styling, layouts, animations, and responsive design.",
    "Vue.js": "Progressive framework for building user interfaces.",
    "Angular": "TypeScript-based platform for building applications.",
    "PHP": "Server-side scripting and web development.",
    "Java": "Object-oriented programming and enterprise development.",
    "C++": "System programming and performance-critical applications.",
    "C#": ".NET framework and Windows application development.",
    "Ruby": "Dynamic programming language and Rails framework.",
    "Go": "Concurrent programming and cloud-native development.",
    "Rust": "Systems programming with memory safety.",
    "Swift": "iOS and macOS application development.",
    "Kotlin": "Modern Android development and JVM programming.",
    "Flutter": "Cross-platform mobile app development.",
    "Laravel": "PHP web application framework.",
    "Django": "High-level Python web framework.",
    "Express.js": "Fast, unopinionated web framework for Node.js.",
    "Flask": "Lightweight Python web application framework.",
    "Spring": "Comprehensive programming and configuration model for Java.",
    "AWS": "Amazon Web Services cloud computing platform.",
    "Azure": "Microsoft cloud computing services.",
    "Linux": "Unix-like operating system commands and administration.",
    "Bash": "Shell scripting and command-line operations.",
    "Vim": "Text editor commands and shortcuts.",
    "VS Code": "Popular code editor tips and shortcuts.",
    "Webpack": "Module bundler and build tool configuration.",
    "Jest": "JavaScript testing framework.",
    "GraphQL": "Query language for APIs and data fetching.",
    "REST API": "Representational State Transfer API design patterns.",
    "SQL": "Structured Query Language for database management.",
    "NoSQL": "Non-relational database concepts and operations.",
    "Kubernetes": "Container orchestration and deployment."
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
        items: s.items.filter((i) => 
          [s.title, i.label, i.code, i.desc].some((t) => t.toLowerCase().includes(q))
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

  const FloatingParticles = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-400">Error Loading Cheat Sheet</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />
      <FloatingParticles />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                {icons.back}
                <span className="font-medium">Back to Home</span>
              </Link>
            </motion.div>

            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Notes & Cheat Sheet
              </h1>
            </div>

            <div className="w-32" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Quick
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              References
            </span>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Searchable snippets and a local library for your development workflow. 
            Files are stored only in your browser - fast, private, and always accessible! 🚀
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cheat sheet (e.g. git push, docker run, array map)"
                className="w-full px-6 py-4 pr-12 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 text-white shadow-2xl"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"></path>
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <span className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300">
              📋 Quick Copy
            </span>
            <span className="px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-300">
              🔍 Instant Search
            </span>
            <span className="px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30 text-orange-300">
              🛡️ Private Storage
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-6 pb-16">
        {sections.length === 0 && !error && (
          <div className="text-center text-gray-400 py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading cheat sheet...
          </div>
        )}

        {/* Category Cards */}
        {!selectedCategory && !query && sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                📚 Choose Category
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 60, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedCategory(section.title)}
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradient(section.title)} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
                  
                  <motion.div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl ${getShadowColor(section.title)} transition-all duration-500 hover:shadow-2xl border border-gray-700 hover:border-gray-600`}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0-20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }} />
                    </div>

                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <motion.div 
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient(section.title)} shadow-lg mb-4 text-2xl`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {iconFor(section.title)}
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4">
                        {categoryDescriptions[section.title] || "Click to explore snippets"}
                      </p>

                      {/* Item Count */}
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <span>{section.items.length} snippets</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${getGradient(section.title)} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Selected Category or Search Results */}
        {(selectedCategory || query) && (
          <>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  All Categories
                </button>
              </motion.div>
            )}

            {filteredSections.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p>Try a different search term or browse categories</p>
              </div>
            )}

            {filteredSections.length > 0 && (
              <div className="space-y-12">
                {filteredSections.map((section, sIdx) => (
                  <motion.section 
                    key={section.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sIdx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Section Header */}
                    {selectedCategory && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                      >
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${getGradient(section.title)} shadow-lg`}>
                          <span className="text-2xl">{iconFor(section.title)}</span>
                          <div>
                            <h2 className="text-xl font-bold text-white">{section.title}</h2>
                            <p className="text-sm opacity-90">{categoryDescriptions[section.title]}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Snippets Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {section.items.map((item, iIdx) => {
                        const key = `${sIdx}-${iIdx}-${item.label}`
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: iIdx * 0.05 }}
                            className="group relative"
                          >
                            {/* Glow Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                            
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 shadow-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                              {/* Header */}
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                    {item.label}
                                  </h3>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {item.desc}
                                  </p>
                                </div>
                                <motion.button
                                  onClick={() => handleCopy(item.code, key)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                    copiedKey === key 
                                      ? 'bg-green-600 text-white border border-green-500' 
                                      : 'bg-gray-800 border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {copiedKey === key ? "Copied!" : "Copy"}
                                </motion.button>
                              </div>

                              {/* Code Block */}
                              <div className="relative">
                                <pre className="bg-black/40 rounded-lg p-4 text-sm overflow-x-auto border border-gray-600/30 font-mono text-gray-300">
                                  {item.code}
                                </pre>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.section>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-gray-700/50">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mb-8"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                CodeWithRaheem
              </h3>
              <p className="text-gray-400">Building the future, one line at a time</p>
            </motion.div>

            <div className="flex justify-center gap-6 mb-8">
              {[
                { href: "https://github.com/RaheemSiddiqui527", color: "hover:text-gray-300", label: "GitHub" },
                { href: "https://twitter.com/codewithraheem", color: "hover:text-blue-400", label: "Twitter" },
                { href: "https://www.linkedin.com/in/codewithraheem", color: "hover:text-blue-600", label: "LinkedIn" },
                { href: "https://www.instagram.com/codewithraheem", color: "hover:text-pink-400", label: "Instagram" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-colors p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.label}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {social.label === 'GitHub' && <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>}
                    {social.label === 'Twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                    {social.label === 'LinkedIn' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                    {social.label === 'Instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                  </svg>
                </motion.a>
              ))}
            </div>

            <div className="border-t border-gray-700/50 pt-8">
              <p className="text-gray-400 text-sm">
                © 2025 CodeWithRaheem. Made with love for developers worldwide.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                DevNotes - Updated regularly • Copy & use safely
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}