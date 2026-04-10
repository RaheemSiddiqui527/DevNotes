'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 dot-pattern opacity-40" />
  </div>
)

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="min-card p-8 group h-full flex flex-col subtle-glow"
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
        {feature.icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">
        {feature.title}
      </h3>
      
      <p className="text-gray-400 text-sm leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

const CategoryCard = ({ category, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    viewport={{ once: true }}
    className="h-full"
  >
    <Link 
      href="/notes" 
      className="min-card p-6 h-full flex flex-col items-center justify-center text-center group hover:border-accent/50 transition-colors"
    >
      <div className="text-lg font-bold text-white mb-1">{category.name}</div>
      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{category.count}</div>
    </Link>
  </motion.div>
)

export default function Home() {
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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: 'Local Library',
      description: 'Upload and store your PDFs, EPUBs, and text files securely in your browser with full offline access.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Copy to Clipboard',
      description: 'One-click copying of code snippets and commands for instant use in your development workflow.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Privacy First',
      description: 'All data stays in your browser. No external servers, no tracking, no data collection. Your notes are truly private.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ]

  const quickCategories = [
    { name: 'Git', count: '46+ commands' },
    { name: 'Docker', count: '47+ snippets' },
    { name: 'React Native', count: '20+ snippets' },
    { name: 'React', count: '28+ patterns' },
    { name: 'Next.js', count: '12+ examples' },
    { name: 'Bash', count: '49+ commands' }
  ]

  const socialLinks = [
    { href: "https://github.com/siddiquiraheem527", label: "GitHub", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
    { href: "https://twitter.com/codewithraheem", label: "Twitter", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> },
    { href: "https://www.linkedin.com/in/codewithraheem", label: "LinkedIn", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
  ]

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden relative">
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.05), transparent 80%)`
        }}
      />
      <FloatingParticles />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center space-x-3">
              <img src="/logo.png" alt="DevNotes Logo" className="w-8 h-8 rounded-lg object-contain" />
              <span>DevNotes</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/notes" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Cheat Sheets</Link>
              <Link href="/library" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Library</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">About</Link>
            </div>
            
            <Link 
              href="/notes" 
              className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter">
            Elevate your <br />
            <span className="text-gray-500">workflow.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Professional cheat sheets and a private local library. 
            Privacy-focused, offline-first, and built for speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/notes" 
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
            >
              Get Started
            </Link>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border border-border-subtle text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* Quick Categories */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Select your toolkit</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {quickCategories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need.
          </h2>
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">Built for efficiency and privacy</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-24 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="min-card p-12 md:p-24 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">
              Ready to boost your <br />
              productivity?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/notes" className="px-8 py-4 bg-white text-black rounded-xl font-bold transition-all hover:bg-gray-200">
                Start Now
              </Link>
              <Link href="/about" className="px-8 py-4 bg-transparent border border-border-subtle text-white rounded-xl font-bold transition-all hover:bg-white/5">
                About the Project
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border-subtle bg-background relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="text-xl font-bold text-white mb-2 tracking-tight">DevNotes</div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Minimalist developer resources, stored locally on your device for maximum privacy.
              </p>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <Link href="/notes" className="text-gray-400 hover:text-white transition-colors">Cheat Sheets</Link>
              <Link href="/library" className="text-gray-400 hover:text-white transition-colors">Library</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-subtle text-xs">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2026 CodeWithRaheem. Created for the developer community.
            </p>
            <div className="flex space-x-6 items-center">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}