"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link";

const icons = {
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent/30 overflow-hidden relative">
      <div className="fixed inset-0 dot-pattern opacity-40 z-0 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
              {icons.back}
              <span>Back</span>
            </Link>
            <div className="text-sm font-bold tracking-tight text-white uppercase opacity-40">About</div>
            <div className="w-12" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
          >
            The <span className="text-gray-500">Project.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
          >
            A minimalist workspace for developer efficiency. Built for speed, privacy, and curated knowledge.
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-24 relative z-10 max-w-4xl">
        <div className="space-y-16">
          {/* Mission */}
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Our Mission</h2>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>
            <div className="min-card p-10 space-y-6">
              <p className="text-xl text-white font-medium leading-relaxed">
                Developers waste too much time searching for the same information repeatedly.
              </p>
              <p className="text-gray-400 leading-relaxed">
                DevNotes exists to consolidate essential knowledge into a clean, distraction-free interface. No context switching, no bookmarked chaos—just the reference you need, exactly when you need it.
              </p>
              <div className="pt-6 border-t border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-white font-bold mb-2">Privacy First</h4>
                  <p className="text-xs text-gray-500">All data stays in your browser. No accounts, no tracking, no servers.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Built for Speed</h4>
                  <p className="text-xs text-gray-500">Lightweight architecture ensures instant loading and snappy interactions.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Open Source</h4>
                  <p className="text-xs text-gray-500">Created by the community for the community. Free forever.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Author */}
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">The Creator</h2>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>
            <div className="min-card p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 rounded-full bg-white/5 border border-border-subtle flex items-center justify-center text-4xl font-bold text-white shrink-0">
                R
              </div>
              <div className="text-center md:text-left space-y-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">CodeWithRaheem</h3>
                <p className="text-gray-400 leading-relaxed">
                  I'm a full-stack developer dedicated to building products that simplify technical workflows. DevNotes is a culmination of my belief that professional tools should be beautiful, private, and extremely fast.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <a href="https://github.com/siddiquiraheem527" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">{icons.github}</a>
                  <a href="https://twitter.com/codewithraheem" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">{icons.twitter}</a>
                  <a href="https://www.linkedin.com/in/codewithraheem" className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">{icons.linkedin}</a>
                </div>

                 
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-background/50 relative z-10 py-12">
        <div className="container mx-auto px-6 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          DevNotes • Developed with precision
        </div>
      </footer>
    </div>
  )
}