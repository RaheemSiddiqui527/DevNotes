"use client"
import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import Link from "next/link";

const icons = {
  website: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 8h6" />
      <path d="M8 12h8" />
      <path d="M8 16h8" />
    </svg>
  ),
  course: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 10-6-6-6 6" />
      <path d="M6 18h12" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  ),
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
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

const ResourceCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getGradient = (type) => {
    switch(type) {
      case 'website': return 'from-blue-600 via-purple-600 to-blue-800'
      case 'book': return 'from-emerald-500 via-teal-600 to-cyan-600'
      case 'course': return 'from-orange-500 via-red-500 to-pink-600'
      default: return 'from-gray-600 to-gray-800'
    }
  }

  const getIconColor = (type) => {
    switch(type) {
      case 'website': return 'text-blue-400'
      case 'book': return 'text-emerald-400'
      case 'course': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getBorderGlow = (type) => {
    switch(type) {
      case 'website': return 'shadow-blue-500/20'
      case 'book': return 'shadow-emerald-500/20'
      case 'course': return 'shadow-orange-500/20'
      default: return 'shadow-gray-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true, amount: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradient(item.type)} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
      
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-2xl ${getBorderGlow(item.type)} transition-all duration-500 hover:shadow-2xl border border-gray-700 hover:border-gray-600`}
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

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              className={`p-3 rounded-xl bg-gradient-to-br ${getGradient(item.type)} ${getIconColor(item.type)} shadow-lg`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {icons[item.type]}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {item.name}
              </h3>
              <p className={`text-sm font-medium ${getIconColor(item.type)} uppercase tracking-wide`}>
                {item.type}
              </p>
            </div>
          </div>

          {/* URL Preview */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-600/30">
            <p className="text-gray-400 text-sm font-mono break-all">
              {item.url.length > 35 ? item.url.substring(0, 35) + '...' : item.url}
            </p>
          </div>

          {/* Action Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Click to explore</span>
            <motion.div
              className="text-gray-400"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.div>
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient(item.type)} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
        />
      </motion.a>
    </motion.div>
  )
}

export default function LibraryPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const resources = [
    {
      category: "📚 Docs & References",
      gradient: "from-blue-600 to-purple-600",
      items: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "website" },
        { name: "Python Documentation", url: "https://docs.python.org/3/", type: "website" },
        { name: "Docker Documentation", url: "https://docs.docker.com/", type: "website" },
        { name: "JavaScript.info", url: "https://javascript.info/", type: "website" },
      ],
    },
    {
      category: "📖 Free Books",
      gradient: "from-emerald-500 to-teal-600",
      items: [
        { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "book" },
        { name: "Think Python", url: "https://greenteapress.com/wp/think-python-2e/", type: "book" },
        { name: "Docker Deep Dive", url: "https://docker-curriculum.com/", type: "book" },
        { name: "The Rust Book", url: "https://doc.rust-lang.org/book/", type: "book" },
        { name: "Go by Example", url: "https://gobyexample.com/", type: "book" },
      ],
    },
    {
      category: "🎓 Learning Platforms",
      gradient: "from-orange-500 to-red-500",
      items: [
        { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", type: "course" },
        { name: "Frontend Masters", url: "https://frontendmasters.com/", type: "course" },
        { name: "CS50 Harvard", url: "https://cs50.harvard.edu/x/", type: "course" },
        { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
        { name: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "course" },
      ],
    },
    {
      category: "⚡ Language References",
      gradient: "from-purple-500 to-pink-500",
      items: [
        { name: "Java Documentation", url: "https://docs.oracle.com/en/java/", type: "website" },
        { name: "C++ Reference", url: "https://en.cppreference.com/w/", type: "website" },
        { name: "Go Documentation", url: "https://go.dev/doc/", type: "website" },
        { name: "Rust Documentation", url: "https://doc.rust-lang.org/", type: "website" },
        { name: "PHP Manual", url: "https://www.php.net/manual/en/", type: "website" },
        { name: "Ruby Documentation", url: "https://www.ruby-lang.org/en/documentation/", type: "website" },
      ],
    },
  ]

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
                Developer Library
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
              Your Dev
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Resources Hub
            </span>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10" />
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Discover carefully curated resources, documentation, books, and courses 
            to supercharge your development journey. All completely free! 🚀
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <span className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300">
              📚 Free Documentation
            </span>
            <span className="px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-300">
              📖 Open Source Books
            </span>
            <span className="px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30 text-orange-300">
              🎓 Learning Platforms
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Resources Grid */}
      <section className="container mx-auto px-6 pb-20">
        <div className="space-y-16">
          {resources.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="text-center mb-12">
                <motion.h2
                  className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent inline-block`}
                  whileHover={{ scale: 1.05 }}
                >
                  {section.category}
                </motion.h2>
                <div className={`w-24 h-1 bg-gradient-to-r ${section.gradient} mx-auto rounded-full`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, index) => (
                  <ResourceCard key={item.url} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
                  className={`text-gray-400 ${social.color} transition-colors p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 hover:scale-110`}
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
                © 2025 CodeWithRaheem. Made with ❤️ for developers worldwide.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                All resources are free and open source. Happy coding! 🚀
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}