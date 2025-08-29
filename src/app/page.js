'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false)

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
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
      
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl border border-gray-700 hover:border-gray-600 transition-all duration-500"
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
            className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor} shadow-lg mb-6`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {feature.icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Hover overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
        />
      </motion.div>
    </motion.div>
  )
}

const CategoryCard = ({ category, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      type: "spring",
      stiffness: 120
    }}
    viewport={{ once: true, amount: 0.3 }}
    className="group relative"
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${category.glowGradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />
    
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link href="/notes" className="block">
        <div className={`${category.bgColor} border-2 ${category.borderColor} rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800`}>
          <div className="font-bold text-xl font-mono mb-2 text-white">{category.name}</div>
          <div className={`text-sm opacity-80 ${category.textColor}`}>{category.count}</div>
        </div>
      </Link>
    </motion.div>
  </motion.div>
)

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      title: 'Searchable Cheat Sheets',
      description: 'Quick access to Git, NPM, Next.js, React, Docker, MongoDB commands and snippets with instant search functionality.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m-4 4l4 4-4 4" />
        </svg>
      ),
      gradient: "from-blue-600 via-purple-600 to-blue-800",
      iconColor: "text-blue-400"
    },
    {
      title: 'Local Library',
      description: 'Upload and store your PDFs, EPUBs, and text files securely in your browser with full offline access.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      iconColor: "text-emerald-400"
    },
    {
      title: 'Copy to Clipboard',
      description: 'One-click copying of code snippets and commands for instant use in your development workflow.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-orange-500 via-red-500 to-pink-600",
      iconColor: "text-orange-400"
    },
    {
      title: 'Privacy First',
      description: 'All data stays in your browser. No external servers, no tracking, no data collection. Your notes are truly private.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: "from-purple-600 via-pink-600 to-red-600",
      iconColor: "text-purple-400"
    }
  ]

  const quickCategories = [
    { 
      name: 'Git', 
      count: '46+ commands', 
      bgColor: 'bg-gradient-to-br from-red-800 to-red-900',
      borderColor: 'border-red-600',
      textColor: 'text-red-200',
      glowGradient: 'from-red-600 to-red-400'
    },
    { 
      name: 'Docker', 
      count: '47+ snippets', 
      bgColor: 'bg-gradient-to-br from-blue-800 to-blue-900',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-200',
      glowGradient: 'from-blue-600 to-blue-400'
    },
    { 
      name: 'React', 
      count: '28+ patterns', 
      bgColor: 'bg-gradient-to-br from-cyan-800 to-cyan-900',
      borderColor: 'border-cyan-600',
      textColor: 'text-cyan-200',
      glowGradient: 'from-cyan-600 to-cyan-400'
    },
    { 
      name: 'Next.js', 
      count: '12+ examples', 
      bgColor: 'bg-gradient-to-br from-gray-800 to-gray-900',
      borderColor: 'border-gray-600',
      textColor: 'text-gray-200',
      glowGradient: 'from-gray-600 to-gray-400'
    },
    { 
      name: 'MongoDB', 
      count: '41+ queries', 
      bgColor: 'bg-gradient-to-br from-green-800 to-green-900',
      borderColor: 'border-green-600',
      textColor: 'text-green-200',
      glowGradient: 'from-green-600 to-green-400'
    },
    { 
      name: 'Bash', 
      count: '49+ commands', 
      bgColor: 'bg-gradient-to-br from-yellow-800 to-yellow-900',
      borderColor: 'border-yellow-600',
      textColor: 'text-yellow-200',
      glowGradient: 'from-yellow-600 to-yellow-400'
    }
  ]

  const socialLinks = [
    { 
      href: "https://github.com/siddiquiraheem527", 
      label: "GitHub", 
      color: "text-white hover:text-gray-300",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    },
    { 
      href: "https://twitter.com/codewithraheem", 
      label: "Twitter", 
      color: "text-blue-400 hover:text-blue-300",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    { 
      href: "https://www.linkedin.com/in/codewithraheem", 
      label: "LinkedIn", 
      color: "text-blue-600 hover:text-blue-500",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      href: "https://www.instagram.com/codewithraheem", 
      label: "Instagram", 
      color: "text-pink-400 hover:text-pink-300",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
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
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Dev</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Notes</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              <Link href="/notes" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Cheat Sheets</Link>
              <Link href="/library" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Library</Link>
              <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">About</Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/notes" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
     <section className="container mx-auto px-4 sm:px-6 pt-20 pb-16 text-center relative">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: "spring" }}
  >
    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 leading-snug sm:leading-tight relative">
      <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl -z-10" />
      <div className="mb-3 sm:mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Function
        </span>{" "}
        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          DeveloperNotes
        </span>
        <span className="text-gray-300">()</span>{" "}
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          return
        </span>{" "}
        <span className="text-orange-400">"</span>
        <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-emerald-400 bg-clip-text text-transparent">
          Cheat Sheets 
        </span>
        <span className="text-orange-400">"</span>
      </div>
    </h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="text-base sm:text-xl md:text-2xl mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
    >
      <span className="text-green-400 block mb-2">// Your go-to resource for quick references, code snippets,</span>
      <span className="text-green-400">
        // and a personal library. Everything stored locally for maximum privacy.
      </span>
    </motion.p>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/notes"
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-purple-500/25 text-white"
        >
          Explore Cheat Sheets
        </Link>
      </motion.div>

      <motion.button
        onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
        className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-orange-500 hover:border-orange-400 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 text-orange-400 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-purple-400">learn</span>
        <span className="text-gray-300">.</span>
        <span className="text-yellow-400">more</span>
        <span className="text-gray-300">()</span>
      </motion.button>
    </motion.div>

    {/* Quick Stats */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm"
    >
      <span className="px-3 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300">
        200+ Commands
      </span>
      <span className="px-3 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-300">
        Lightning Fast
      </span>
      <span className="px-3 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-300">
        Privacy First
      </span>
      <span className="px-3 py-2 bg-orange-500/20 rounded-full border border-orange-500/30 text-orange-300">
        Completely Free
      </span>
    </motion.div>
  </motion.div>
</section>


      {/* Quick Categories */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-purple-400">const</span>{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">popularCategories</span>{' '}
            <span className="text-gray-300">=</span>
          </h2>
          <p className="text-green-400 text-xl">// Jump straight to what you need</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {quickCategories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-purple-400">class</span>{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">EverythingYouNeed</span>{' '}
            <span className="text-gray-300">{'{}'}</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-4">
            <span className="text-green-400">// Built for developers who value efficiency, privacy,</span>
          </p>
          <p className="text-xl max-w-3xl mx-auto">
            <span className="text-green-400">// and having their tools readily accessible</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-20" />
          
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0-20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>

           <div className="relative z-10 w-full max-w-[90%] mx-auto px-4 py-8">

  {/* Code Snippet */}
  <div className="bg-gray-900 p-4 rounded-lg text-left overflow-x-auto text-sm sm:text-base font-mono mb-6">
    <pre className="whitespace-pre-wrap break-words">
      <code>
        <span className="text-purple-400">if</span>
        <span className="text-gray-300"> (</span>
        <span className="text-cyan-400">developer.needsQuickReference</span>
        <span className="text-gray-300">) {'{'}</span>
        {"\n  "}
        <span className="text-purple-400">return</span>{' '}
        <span className="text-orange-400">"</span>
        <span className="text-emerald-400">Start using DevNotes today!</span>
        <span className="text-orange-400">"</span>
        <span className="text-gray-300">;</span>
        {"\n"}
        <span className="text-gray-300">{'}'}</span>
      </code>
    </pre>
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 mb-8">
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
      <Link 
        href="/notes" 
        className="block text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-base transition-all duration-300 shadow-xl hover:shadow-blue-500/25 text-white w-full"
      >
        Start Coding Faster
      </Link>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
      <Link 
        href="/library" 
        className="block text-center px-6 py-3 border-2 border-emerald-500 hover:border-emerald-400 rounded-xl font-semibold text-base transition-all duration-300 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 w-full"
      >
        Build Your Library
      </Link>
    </motion.div>
  </div>
</div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-gray-700/50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center md:text-left mb-8 md:mb-0"
            >
              <div className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Dev</span>
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Notes</span>
              </div>
              <p className="text-green-400 text-lg mb-1">
                // Quick references for daily dev work
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-green-400">// by</span>{' '}
                <span className="text-emerald-400">CodeWithRaheem</span>
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex space-x-8">
                <Link href="/notes" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Cheat Sheets</Link>
                <Link href="/library" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Library</Link>
                <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">About</Link>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.3 
                    }}
                    className={`${social.color} transition-all duration-300 p-2 rounded-lg hover:bg-gray-800/50`}
                    title={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700/50 pt-8">
            <div className="text-center text-gray-400 space-y-2">
              <p className="text-lg">
                <span className="text-purple-400">console</span>
                <span className="text-gray-300">.</span>
                <span className="text-yellow-400">log</span>
                <span className="text-gray-300">(</span>
                <span className="text-orange-400">"Built with Next.js • All data stored locally in your browser"</span>
                <span className="text-gray-300">);</span>
              </p>
              <p className="text-sm">
                © 2025 CodeWithRaheem. Made with ❤️ for developers worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}