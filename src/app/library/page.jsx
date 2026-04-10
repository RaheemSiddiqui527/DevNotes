"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link";

const icons = {
  website: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 8h6" />
      <path d="M8 12h8" />
    </svg>
  ),
  course: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 10-6-6-6 6" />
      <path d="M6 18h12" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  ),
  back: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

const ResourceCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-card p-6 block group hover:border-accent/50 transition-colors"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
            {icons[item.type]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors truncate">
              {item.name}
            </h3>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">
              {item.type}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 font-mono truncate px-3 py-2 bg-black/20 rounded-lg border border-white/5">
          {item.url.replace('https://', '').replace('www.', '')}
        </div>
      </a>
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
      category: "Docs & References",
      items: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "website" },
        { name: "Python Documentation", url: "https://docs.python.org/3/", type: "website" },
        { name: "Docker Documentation", url: "https://docs.docker.com/", type: "website" },
        { name: "JavaScript.info", url: "https://javascript.info/", type: "website" },
      ],
    },
    {
      category: "Free Books",
      items: [
        { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "book" },
        { name: "Think Python", url: "https://greenteapress.com/wp/think-python-2e/", type: "book" },
        { name: "Docker Deep Dive", url: "https://docker-curriculum.com/", type: "book" },
        { name: "The Rust Book", url: "https://doc.rust-lang.org/book/", type: "book" },
        { name: "Go by Example", url: "https://gobyexample.com/", type: "book" },
      ],
    },
    {
      category: "Learning Platforms",
      items: [
        { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", type: "course" },
        { name: "Frontend Masters", url: "https://frontendmasters.com/", type: "course" },
        { name: "CS50 Harvard", url: "https://cs50.harvard.edu/x/", type: "course" },
        { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
        { name: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "course" },
      ],
    },
    {
      category: "Language References",
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
            <div className="text-sm font-bold tracking-tight text-white uppercase opacity-40">Library</div>
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
            Dev <span className="text-gray-500">Resources.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
          >
            Hand-picked resources, documentation, and tools to elevate your development knowledge.
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-24 relative z-10 max-w-6xl">
        <div className="space-y-24">
          {resources.map((section, sIdx) => (
            <div key={section.category} className="space-y-8">
              <div className="flex items-center gap-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{section.category}</h2>
                <div className="flex-1 h-px bg-border-subtle" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, idx) => (
                  <ResourceCard key={item.url} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-background/50 relative z-10 py-12">
        <div className="container mx-auto px-6 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          DevNotes • Curated Knowledge Base
        </div>
      </footer>
    </div>
  )
}