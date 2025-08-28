"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

// Icons - You'll need a library like lucide-react or similar
// For this example, we'll use inline SVGs
const icons = {
  website: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
    </svg>
  ),
  book: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-text">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M8 8h6" /><path d="M8 12h8" /><path d="M8 16h8" />
    </svg>
  ),
  course: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
      <path d="M21.42 10.962L2.58 1.038C2.33 0.916 2 1.096 2 1.378V23c0 .35 0 .596.118.824.119.228.324.376.575.452.25.076.54.02.775-.152l18.84-9.925C21.84 13.313 22 13.065 22 12.75V12c0-.282-.162-.516-.388-.638z" />
      <path d="M16 16v-6l-4 2-4-2v6l4 2z" />
    </svg>
  )
}

const ResourceCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      key={item.url}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative block overflow-hidden rounded-xl border border-white/20 bg-white/5 p-5 shadow-xl transition-all duration-300 hover:scale-[1.03]"
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
        animate={{
          opacity: isHovered ? 1 : 0,
          background: isHovered
            ? "radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, rgba(0,0,0,0) 70%)"
            : "rgba(0,0,0,0)",
        }}
      />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-purple-300">{icons[item.type]}</div>
          <div className="font-semibold text-purple-200">
            {item.name}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </div>
      </div>
    </motion.a>
  )
}

export default function LibraryPage() {
  const resources = [
    {
      category: "Docs & References",
      items: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org", type: "website" },
        { name: "Python Docs", url: "https://docs.python.org/3/", type: "website" },
        { name: "Docker Docs", url: "https://docs.docker.com/", type: "website" },
        { name: "JavaScript.info", url: "https://javascript.info/", type: "website" },
      ],
    },
    {
      category: "Books (Free)",
      items: [
        { name: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "book" },
        { name: "Think Python", url: "https://greenteapress.com/wp/think-python-2e/", type: "book" },
        { name: "Dive Into Docker", url: "https://docker-curriculum.com/", type: "book" },
        { name: "Rust Book", url: "https://doc.rust-lang.org/book/", type: "book" },
        { name: "The Go Programming Language", url: "https://www.gopl.io/", type: "book" },
      ],
    },
    {
      category: "Learning Platforms",
      items: [
        { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", type: "course" },
        { name: "Frontend Masters", url: "https://frontendmasters.com/", type: "course" },
        { name: "CS50 (Harvard)", url: "https://cs50.harvard.edu/x/", type: "course" },
        { name: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
        { name: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "course" },
      ],
    },
    {
      category: "Language Docs",
      items: [
        { name: "Java Docs", url: "https://docs.oracle.com/en/java/", type: "website" },
        { name: "C++ Reference", url: "https://en.cppreference.com/w/", type: "website" },
        { name: "Go Docs", url: "https://go.dev/doc/", type: "website" },
        { name: "Rust Docs", url: "https://doc.rust-lang.org/", type: "website" },
        { name: "PHP Manual", url: "https://www.php.net/manual/en/", type: "website" },
        { name: "Ruby Docs", url: "https://www.ruby-lang.org/en/documentation/", type: "website" },
      ],
    },
  ];

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
      <header className="container mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-8 md:pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Your Personal Dev Library
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 max-w-2xl mx-auto text-lg"
        >
          Explore a curated list of free resources, docs, books, and courses to enhance your development skills.
        </motion.p>
      </header>

      {/* Resources */}
      <section className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-12">
          {resources.map((res, resIndex) => (
            <section key={res.category}>
              <motion.h3
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-2xl md:text-3xl font-bold mb-6 text-purple-200"
              >
                {res.category}
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {res.items.map((item, index) => (
                  <ResourceCard key={item.url} item={item} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="bg-black/50 py-8 border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-gray-300 font-medium">
            DevNotes • Developer Cheat Sheets <br className="md:hidden" />
            <span className="text-sm text-gray-400">by CodeWithRaheem</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-gray-400 text-sm">
              Updated regularly • Copy & use safely
            </p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="https://github.com/RaheemSiddiqui527" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg"
                  alt="GitHub"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a href="https://twitter.com/codewithraheem" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg"
                  alt="Twitter"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a href="https://www.linkedin.com/in/codewithraheem" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg"
                  alt="LinkedIn"
                  className="w-5 h-5 filter invert hover:invert-0 transition"
                />
              </a>
              <a href="https://www.instagram.com/codewithraheem" target="_blank" rel="noopener noreferrer">
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