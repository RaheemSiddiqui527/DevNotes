'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      title: 'Searchable Cheat Sheets',
      description: 'Quick access to Git, NPM, Next.js, React, Docker, MongoDB commands and snippets',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m-4 4l4 4-4 4" />
        </svg>
      ),
      color: 'from-blue-400 to-purple-600'
    },
    {
      title: 'Local Library',
      description: 'Upload and store your PDFs, EPUBs, and text files securely in your browser',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-green-400 to-blue-600'
    },
    {
      title: 'Copy to Clipboard',
      description: 'One-click copying of code snippets and commands for instant use',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-400 to-pink-600'
    },
    {
      title: 'Privacy First',
      description: 'All data stays in your browser. No external servers, no tracking, no data collection',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'from-orange-400 to-red-600'
    }
  ]

  const quickCategories = [
    { name: 'Git', count: '10+ commands', color: 'bg-red-500/20 text-red-300' },
    { name: 'Docker', count: '8+ snippets', color: 'bg-blue-500/20 text-blue-300' },
    { name: 'React', count: '15+ patterns', color: 'bg-cyan-500/20 text-cyan-300' },
    { name: 'Next.js', count: '12+ examples', color: 'bg-gray-500/20 text-gray-300' },
    { name: 'MongoDB', count: '6+ queries', color: 'bg-green-500/20 text-green-300' },
    { name: 'Bash', count: '8+ commands', color: 'bg-yellow-500/20 text-yellow-300' }
  ]

  const socialLinks = [
    {
      href: "https://github.com/siddiquiraheem527",
      src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
      alt: "GitHub",
    },
    {
      href: "https://twitter.com/codewithraheem",
      src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
      alt: "Twitter",
    },
    {
      href: "https://www.linkedin.com/in/codewithraheem",
      src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
      alt: "LinkedIn",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DevNotes
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/notes" className="text-gray-300 hover:text-white transition-colors">Cheat Sheets</Link>
            <Link href="/library" className="text-gray-300 hover:text-white transition-colors">Library</Link>
          </div>
          <Link href="/auth" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-14 sm:pt-16 pb-10 sm:pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Developer Notes & 
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Cheat Sheet
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your go-to resource for quick references, code snippets, and a personal library. Everything stored locally for maximum privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/notes" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
              Explore Cheat Sheets
            </Link>
            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 border border-white/20 hover:border-purple-400/50 rounded-lg font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Quick Search Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-16 max-w-2xl mx-auto">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try searching: git push, docker run, useEffect..."
              className="w-full px-6 py-4 text-lg rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
            />
            <svg className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"></path>
            </svg>
          </div>
          <p className="text-sm text-gray-400 mt-2">Search through 70+ developer commands and snippets</p>
        </motion.div>
      </section>

      {/* Quick Categories */}
      <section className="container mx-auto px-4 sm:px-6 pb-14 sm:pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
          <p className="text-gray-300">Jump straight to what you need</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickCategories.map((category, idx) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
              <Link href="/notes" className="block">
                <div className={`${category.color} rounded-lg p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="font-semibold text-lg">{category.name}</div>
                  <div className="text-sm opacity-80">{category.count}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built for developers who value efficiency, privacy, and having their tools readily accessible
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, duration: 0.6 }} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers who save time with instant access to commands, snippets, and their personal library.
          </p>
          <Link href="/auth" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
            Start Using DevNotes
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                DevNotes
              </div>
              <p className="text-gray-400">Quick references for daily dev work</p>
              <p className="text-gray-400 text-sm mt-1">by CodeWithRaheem</p>
            </div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/notes" className="text-gray-400 hover:text-white transition-colors">Cheat Sheets</Link>
              <Link href="/library" className="text-gray-400 hover:text-white transition-colors">Library</Link>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a key={social.alt} href={social.href} target="_blank" rel="noopener noreferrer">
                  <img src={social.src} alt={social.alt} className="w-5 h-5 filter invert hover:invert-0 transition" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-8">
            Built with Next.js • All data stored locally in your browser
          </div>
        </div>
      </footer>

    </div>
  )
}
