'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function About() {
  const socialLinks = [
    { href: "https://github.com/siddiquiraheem527", label: "GitHub" },
    { href: "https://twitter.com/codewithraheem", label: "Twitter" },
    { href: "https://www.linkedin.com/in/codewithraheem", label: "LinkedIn" },
    { href: "https://www.instagram.com/codewithraheem", label: "Instagram" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6"
        >
          About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">DevNotes</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
        >
          DevNotes is your personal companion for quick references, 
          developer cheat sheets, and a private local library. 
          Built with a <span className="text-purple-400">privacy-first</span> approach — 
          everything stays in your browser, no external servers.
        </motion.p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {[
          {
            title: "Why DevNotes?",
            desc: "Because searching docs repeatedly kills productivity. DevNotes gives you instant access to commands, snippets & examples."
          },
          {
            title: "Privacy First",
            desc: "No login, no signup, no server. All your notes & library stay securely in your browser."
          },
          {
            title: "Open & Free",
            desc: "Made by developers, for developers. Fully free, lightweight, and focused on saving your time."
          }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.2, duration: 0.6 }} 
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-300 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Social Links */}
      <section className="container mx-auto px-6 py-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-3xl font-bold mb-6"
        >
          Connect with Me
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <footer className="text-center text-gray-400 py-8 border-t border-white/10">
        <p>Made with ❤️ by <span className="text-purple-400">CodeWithRaheem</span></p>
      </footer>
    </div>
  )
}
