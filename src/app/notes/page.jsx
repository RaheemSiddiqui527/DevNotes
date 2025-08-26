"use client"
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NotesCheatSheet() {
  const [query, setQuery] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const cat = searchParams.get('cat')
    setSelectedCategory(cat || null)
  }, [searchParams])
  
  // ---------- Cheat sheet data ----------
  const sections = [
    {
      title: 'Git Essentials',
      items: [
        { label: 'Initialize repo', code: 'git init', desc: 'Create a new local Git repository.' },
        { label: 'Clone', code: 'git clone <url>', desc: 'Clone a remote repository.' },
        { label: 'Status', code: 'git status', desc: 'Show changed files in your working directory.' },
        { label: 'Add changes', code: 'git add .', desc: 'Stage all changes.' },
        { label: 'Commit', code: "git commit -m 'feat: message'", desc: 'Commit staged changes with a message.' },
        { label: 'Set remote', code: 'git remote add origin <url>', desc: 'Link local repo to a remote.' },
        { label: 'Push', code: 'git push -u origin main', desc: 'Push commits to the main branch and set upstream.' },
        { label: 'New branch', code: 'git checkout -b feature/awesome', desc: 'Create and switch to a new branch.' },
        { label: 'Merge', code: 'git merge feature/awesome', desc: 'Merge a branch into the current branch.' },
        { label: 'Rebase (update branch)', code: 'git fetch origin && git rebase origin/main', desc: 'Replay your commits on top of latest main.' },
      ],
    },
    {
      title: 'NPM / Yarn',
      items: [
        { label: 'Init', code: 'npm init -y', desc: 'Create package.json quickly.' },
        { label: 'Install dep', code: 'npm i <pkg>', desc: 'Install a dependency.' },
        { label: 'Install dev dep', code: 'npm i -D <pkg>', desc: 'Install a dev dependency.' },
        { label: 'Run script', code: 'npm run <script>', desc: 'Execute a package script.' },
        { label: 'Update all', code: 'npm outdated && npm update', desc: 'Check and update packages.' },
      ],
    },
    {
      title: 'Next.js Data Fetching',
      items: [
        { label: 'Static props', code: 'export async function getStaticProps() {\n  return { props: { /* data */ } }\n}', desc: 'Fetch at build time.' },
        { label: 'Server-side props', code: 'export async function getServerSideProps(ctx) {\n  return { props: { /* data */ } }\n}', desc: 'Fetch on every request.' },
        { label: 'Static paths', code: 'export async function getStaticPaths() {\n  return { paths: [], fallback: false }\n}', desc: 'Define dynamic static routes.' },
      ],
    },
    {
      title: 'React Patterns',
      items: [
        { label: 'State update from prev', code: 'setCount(prev => prev + 1)', desc: 'Safe state update using previous value.' },
        { label: 'Effect with cleanup', code: 'useEffect(() => {\n  const id = setInterval(doWork, 1000)\n  return () => clearInterval(id)\n}, [])', desc: 'Cleanup side-effects to avoid leaks.' },
        { label: 'Memoize expensive calc', code: 'const value = useMemo(() => heavy(data), [data])', desc: 'Avoid recomputation on every render.' },
      ],
    },
    {
      title: 'Bash / Shell',
      items: [
        { label: 'List', code: 'ls -la', desc: 'Long list including hidden files.' },
        { label: 'Find by name', code: 'find . -name "*.js"', desc: 'Find files by pattern.' },
        { label: 'Search in files', code: 'grep -R "pattern" .', desc: 'Recursive text search.' },
        { label: 'Archive', code: 'tar -czf archive.tgz folder/', desc: 'Create compressed tar archive.' },
      ],
    },
    {
      title: 'Docker',
      items: [
        { label: 'Build', code: 'docker build -t myapp:latest .', desc: 'Build an image from Dockerfile.' },
        { label: 'Run', code: 'docker run --rm -p 3000:3000 myapp:latest', desc: 'Run container mapping port 3000.' },
        { label: 'List', code: 'docker ps -a', desc: 'List containers.' },
        { label: 'Prune', code: 'docker system prune -af', desc: 'Remove unused data.' },
      ],
    },
    {
      title: 'MongoDB',
      items: [
        { label: 'Connect', code: 'mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority', desc: 'MongoDB Atlas connection string.' },
        { label: 'Find', code: 'db.users.find({ active: true })', desc: 'Query active users.' },
        { label: 'Index', code: 'db.users.createIndex({ email: 1 }, { unique: true })', desc: 'Create unique index on email.' },
      ],
    },
    {
      title: 'HTTP Status Codes',
      items: [
        { label: '200 OK', code: '200', desc: 'Successful request.' },
        { label: '201 Created', code: '201', desc: 'Resource created.' },
        { label: '400 Bad Request', code: '400', desc: 'Invalid client input.' },
        { label: '401 Unauthorized', code: '401', desc: 'Auth required or failed.' },
        { label: '403 Forbidden', code: '403', desc: 'No permission.' },
        { label: '404 Not Found', code: '404', desc: 'Resource not found.' },
        { label: '500 Server Error', code: '500', desc: 'Unexpected server error.' },
      ],
    },
    {
      title: 'Regex Quickies',
      items: [
        { label: 'Email', code: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', desc: 'Basic email pattern.' },
        { label: 'URL', code: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/\\=]*)', desc: 'HTTP/HTTPS URL.' },
        { label: 'Digits only', code: '^\\d+$', desc: 'One or more digits.' },
      ],
    },
  ,
    {
      title: 'JavaScript',
      items: [
        { label: 'Declare var', code: 'const x = 1; let y = 2; var z = 3;', desc: 'const, let, var.' },
        { label: 'Arrow func', code: 'const add = (a, b) => a + b;', desc: 'Concise function.' },
        { label: 'Array map', code: '[1,2,3].map(n => n * 2)', desc: 'Transform an array.' },
        { label: 'Optional chaining', code: 'obj?.user?.email ?? "N/A"', desc: 'Safe property access with default.' },
        { label: 'Fetch', code: 'const res = await fetch("/api"); const json = await res.json();', desc: 'HTTP request in modern JS.' },
      ],
    },
    {
      title: 'TypeScript',
      items: [
        { label: 'Type alias', code: 'type User = { id: number; name: string }', desc: 'Custom type.' },
        { label: 'Interface', code: 'interface Point { x: number; y: number }', desc: 'Shape for objects.' },
        { label: 'Generic', code: 'function wrap<T>(value: T): T { return value }', desc: 'Generics for reusability.' },
        { label: 'Union', code: 'let id: string | number', desc: 'Variable with multiple types.' },
        { label: 'Narrowing', code: 'if (typeof id === "string") { /* ... */ }', desc: 'Refine type at runtime.' },
      ],
    },
    {
      title: 'Python',
      items: [
        { label: 'List comp', code: '[x * 2 for x in range(5)]', desc: 'Create list with comprehension.' },
        { label: 'Dict literal', code: '{"a": 1, "b": 2}', desc: 'Create dictionary.' },
        { label: 'Function', code: 'def add(a, b):\n    return a + b', desc: 'Define function.' },
        { label: 'Virtual env', code: 'python -m venv .venv && source .venv/bin/activate', desc: 'Create and activate venv.' },
        { label: 'Pip install', code: 'pip install requests', desc: 'Install package.' },
      ],
    },
    {
      title: 'Java',
      items: [
        { label: 'Main class', code: 'public class Main {\n  public static void main(String[] args){\n    System.out.println("Hello");\n  }\n}', desc: 'Program entry point.' },
        { label: 'List', code: 'List<Integer> nums = new ArrayList<>();', desc: 'Generic collection.' },
        { label: 'Stream map', code: 'nums.stream().map(n -> n * 2).toList();', desc: 'Functional pipeline.' },
        { label: 'Record', code: 'record User(int id, String name) {}', desc: 'Immutable data class (Java 16+).' },
      ],
    },
    {
      title: 'C#',
      items: [
        { label: 'Main', code: 'Console.WriteLine("Hello");', desc: '.NET console output.' },
        { label: 'List', code: 'var list = new List<int> { 1, 2, 3 };', desc: 'Generic list.' },
        { label: 'Linq', code: 'var doubled = list.Select(n => n * 2).ToList();', desc: 'Query/transform collections.' },
        { label: 'Record', code: 'public record User(int Id, string Name);', desc: 'Immutable type.' },
      ],
    },
    {
      title: 'Go',
      items: [
        { label: 'Hello', code: 'package main\nimport "fmt"\nfunc main(){\n  fmt.Println("Hello")\n}', desc: 'Basic program.' },
        { label: 'Goroutine', code: 'go func(){ fmt.Println("concurrent") }()', desc: 'Lightweight thread.' },
        { label: 'Channel', code: 'c := make(chan int)\ngo func(){ c <- 1 }()\n<-c', desc: 'Sync using channels.' },
        { label: 'Module init', code: 'go mod init example.com/app', desc: 'Init module.' },
      ],
    },
    {
      title: 'Rust',
      items: [
        { label: 'Hello', code: 'fn main(){ println!("Hello"); }', desc: 'Basic program.' },
        { label: 'Vec', code: 'let mut v = vec![1,2,3]; v.push(4);', desc: 'Growable vector.' },
        { label: 'Result', code: 'fn do_it() -> Result<(), Box<dyn Error>> { Ok(()) }', desc: 'Error handling.' },
        { label: 'Option match', code: 'match maybe { Some(x) => x, None => 0 }', desc: 'Pattern match optional.' },
      ],
    },
    {
      title: 'SQL',
      items: [
        { label: 'Create table', code: 'CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL);', desc: 'DDL example.' },
        { label: 'Select', code: 'SELECT id, email FROM users WHERE active = true ORDER BY id DESC LIMIT 10;', desc: 'Query data.' },
        { label: 'Insert', code: "INSERT INTO users (email, active) VALUES ('a@b.com', true);", desc: 'Add a row.' },
        { label: 'Index', code: 'CREATE INDEX idx_users_email ON users (email);', desc: 'Speed up lookup.' },
      ],
    }
  ,
    {
      title: 'Web & Frontend',
      items: [
        { label: 'TypeScript basics', code: 'type User = { id: number; name: string }\ninterface Point { x: number; y: number }\nfunction id<T>(x: T): T { return x }', desc: 'Types, interfaces, generics.' },
        { label: 'HTML5 semantics', code: '<header>...</header>\n<nav>...</nav>\n<main>\n  <section>...</section>\n  <article>...</article>\n</main>\n<footer>...</footer>', desc: 'Use semantic tags for structure & a11y.' },
        { label: 'CSS Grid/Flex', code: '/* Grid */\n.container{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:1rem;}\n/* Flex */\n.row{display:flex;align-items:center;justify-content:space-between;gap:1rem;}', desc: 'Modern layout primitives.' },
        { label: 'Tailwind quickies', code: 'Flex center: flex items-center justify-center\nGrid: grid grid-cols-12 gap-4\nBtn: px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white', desc: 'Common utility patterns.' },
      ],
    },
    {
      title: 'Backend & APIs',
      items: [
        { label: 'Go HTTP', code: 'package main\nimport (\n  "fmt"\n  "net/http"\n)\nfunc main(){\n  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){\n    fmt.Fprintln(w, "ok")\n  })\n  http.ListenAndServe(":8080", nil)\n}', desc: 'Minimal net/http server.' },
        { label: 'Rust axum', code: 'use axum::{routing::get, Router};\n#[tokio::main]\nasync fn main(){\n  let app = Router::new().route("/", get(|| async { "ok" }));\n  axum::Server::bind(&"0.0.0.0:3000".parse().unwrap()).serve(app.into_make_service()).await.unwrap();\n}', desc: 'Tiny async web server.' },
        { label: 'PHP JSON', code: '<?php\nheader("Content-Type: application/json");\necho json_encode(["status" => "ok"]);', desc: 'Return JSON response.' },
        { label: 'Ruby Sinatra', code: 'require "sinatra"\nget("/") { "ok" }', desc: 'Tiny web route.' },
      ],
    },
    {
      title: 'Mobile',
      items: [
        { label: 'Kotlin function', code: 'fun greet(name: String): String = "Hello, $name"', desc: 'Kotlin expression function.' },
        { label: 'SwiftUI View', code: 'import SwiftUI\nstruct ContentView: View {\n  var body: some View {\n    Text("Hello").padding()\n  }\n}', desc: 'Minimal SwiftUI component.' },
        { label: 'Flutter widget', code: 'class Hello extends StatelessWidget {\n  @override\n  Widget build(BuildContext ctx) => Text("Hello");\n}', desc: 'StatelessWidget example.' },
      ],
    },
    {
      title: 'Data & Machine Learning',
      items: [
        { label: 'R dplyr', code: 'library(dplyr)\nmtcars %>% filter(mpg > 20) %>% group_by(cyl) %>% summarise(avg = mean(mpg))', desc: 'Filter, group, summarise.' },
        { label: 'Julia basics', code: 'f(x) = x^2\nxs = [1,2,3]\nys = f.(xs)', desc: 'Function and broadcasting.' },
        { label: 'MATLAB plot', code: 'x = 0:0.1:10; y = sin(x);\nplot(x,y); grid on; title("Sine");', desc: 'Plot in MATLAB/Octave.' },
      ],
    },
    {
      title: 'Systems & Scripting',
      items: [
        { label: 'Bash find/grep', code: 'find . -type f -name "*.js" -print0 | xargs -0 grep -n "pattern"', desc: 'Search text in files.' },
        { label: 'C Hello', code: '#include <stdio.h>\nint main(void){ printf("Hello\\n"); return 0; }', desc: 'Smallest C program.' },
        { label: 'C++ vector', code: '#include <vector>\n#include <algorithm>\nint main(){ std::vector<int> v{1,2,3}; std::for_each(v.begin(), v.end(), [](int &x){ x*=2; }); }', desc: 'STL and lambda.' },
        { label: 'x86-64 asm', code: 'global _start\n_start:\n  mov rax, 60 ; exit\n  xor rdi, rdi\n  syscall', desc: 'Linux exit syscall.' },
      ],
    },
    {
      title: 'DevOps / Infra',
      items: [
        { label: 'K8s Deployment (YAML)', code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: app\n  template:\n    metadata:\n      labels:\n        app: app\n    spec:\n      containers:\n        - name: app\n          image: nginx:alpine\n          ports:\n            - containerPort: 80', desc: 'Kubernetes basic deploy.' },
        { label: 'Terraform HCL', code: 'terraform { required_version = ">= 1.5.0" }\nprovider "aws" { region = "us-east-1" }\nresource "aws_s3_bucket" "b" { bucket = "example-bucket" }', desc: 'HCL example resource.' },
        { label: 'Ansible play', code: '- hosts: web\n  become: true\n  tasks:\n    - name: Install nginx\n      apt: { name: nginx, state: present, update_cache: yes }\n    - name: Start nginx\n      service: { name: nginx, state: started, enabled: yes }', desc: 'Playbook tasks.' },
      ],
    },
    {
      title: 'Security / Blockchain',
      items: [
        { label: 'Solidity storage', code: 'pragma solidity ^0.8.0;\ncontract Storage {\n  uint256 public value;\n  function set(uint256 v) public { value = v; }\n}', desc: 'Simple state variable.' },
        { label: 'Move module', code: 'module 0x1::hello {\n  public fun hi(): u64 { 42 }\n}', desc: 'Tiny Move example.' },
      ],
    }
  ]

  const iconFor = (title) => {
    const iconMap = {
      'Web & Frontend': '🌐',
      'Backend & APIs': '⚙️',
      'Mobile': '📱',
      'Data & Machine Learning': '📊',
      'Systems & Scripting': '🐧',
      'DevOps / Infra': '☁️',
      'Security / Blockchain': '🛡️',
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Python': '🐍',
      'Java': '☕',
      'C#': '#️',
      'Go': '🐹',
      'Rust': '🦀',
      'SQL': '🗄️',
      'Docker': '🐳',
      'MongoDB': '🍃',
      'Bash / Shell': '💻',
      'Regex Quickies': '#️⃣',
      'HTTP Status Codes': '📄',
      'Git Essentials': '🌿',
      'NPM / Yarn': '📦',
      'Next.js Data Fetching': '⚡',
      'React Patterns': '⚛️',
    }
    const i = iconMap[title] || '📘'
    return <span aria-hidden="true" className="text-xl">{i}</span>
  }

  const logoFor = (title) => {
    const map = {
      'Web & Frontend': 'html5',
      'Backend & APIs': 'nodedotjs',
      'Mobile': 'android',
      'Data & Machine Learning': 'tensorflow',
      'Systems & Scripting': 'linux',
      'DevOps / Infra': 'kubernetes',
      'Security / Blockchain': 'solidity',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'openjdk',
      'C#': 'csharp',
      'Go': 'go',
      'Rust': 'rust',
      'SQL': 'postgresql',
      'Docker': 'docker',
      'MongoDB': 'mongodb',
      'Bash / Shell': 'gnubash',
      'Regex Quickies': null,
      'HTTP Status Codes': 'httpie',
      'Git Essentials': 'git',
      'NPM / Yarn': 'npm',
      'Next.js Data Fetching': 'nextdotjs',
      'React Patterns': 'react',
    }
    const slug = map[title]
    return slug ? `https://cdn.simpleicons.org/${slug}` : null
  }

  const categoryDescriptions = {
    'Git Essentials': 'Core git commands for daily workflows.',
    'NPM / Yarn': 'Package management and scripts.',
    'Next.js Data Fetching': 'Build-time and server-side data fetching.',
    'React Patterns': 'Common hooks and patterns.',
    'Bash / Shell': 'CLI commands for productivity.',
    'Docker': 'Containers, images, and commands.',
    'MongoDB': 'Connection strings and queries.',
    'HTTP Status Codes': 'Common responses and meanings.',
    'Regex Quickies': 'Useful regular expressions.',
    'JavaScript': 'Language essentials and idioms.',
    'TypeScript': 'Types, interfaces, and generics.',
    'Python': 'Syntax and common utilities.',
    'Java': 'Core language constructs.',
    'C#': 'Modern C# features.',
    'Go': 'Goroutines and channels.',
    'Rust': 'Ownership, result/option basics.',
    'SQL': 'DDL and DML cheats.',
    'Web & Frontend': 'UI, HTML5, CSS, TS and tooling.',
    'Backend & APIs': 'Servers and API frameworks.',
    'Mobile': 'Kotlin, Swift, Flutter basics.',
    'Data & Machine Learning': 'R, Julia, MATLAB snippets.',
    'Systems & Scripting': 'C/C++, Bash, Assembly.',
    'DevOps / Infra': 'K8s, Terraform, Ansible.',
    'Security / Blockchain': 'Solidity and Move basics.',
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
      // noop
    }
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white">
        {/* Top Bar */}
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

        {/* Header */}
        <header className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-5 sm:pb-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Quick References for Daily Dev Work
          </motion.h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Searchable snippets, and a local library for your PDFs/EPUBs. Files are stored only in your browser (IndexedDB).
          </p>

          <div className="mt-6 max-w-2xl mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cheat sheet (e.g. git push, getStaticProps, docker run)"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400 placeholder-gray-400"
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"></path>
              </svg>
            </div>
          </div>
        </header>

        
        {/* Content */}
        <main className="container mx-auto px-4 sm:px-6 pb-16">
          {/* Category Cards */}
          {!selectedCategory && !query && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
              {sections.map((s) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="cursor-pointer group"
                    style={{ perspective: 1000 }}
                    onClick={() => {
                      setSelectedCategory(s.title)
                      router.push(`/notes?cat=${encodeURIComponent(s.title)}`)
                    }}
                  >
                    <motion.div
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="relative w-full aspect-square"
                    >
                      <div
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-purple-400/40 transition-colors"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {logoFor(s.title) ? (
                          <img src={logoFor(s.title)} alt={`${s.title} logo`} className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow" />
                        ) : (
                          <div className="text-4xl">{iconFor(s.title)}</div>
                        )}
                        <div className="text-center">
                          <h3 className="font-semibold text-purple-200">{s.title}</h3>
                          <div className="text-xs text-gray-300 mt-1">{s.items.length} items</div>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center justify-center text-center hover:border-purple-400/40 transition-colors"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <div className="text-sm text-gray-200 mb-2">{categoryDescriptions[s.title] || 'Open to view snippets.'}</div>
                          <div className="text-xs text-gray-400">Click to open</div>
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
                  <button onClick={() => setSelectedCategory(null)} className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white">← All Categories</button>
                </div>
              )}
              {filteredSections.length === 0 && (
                <div className="text-center text-gray-400 py-16">No matches found.</div>
              )}
            </>

          )}

          {(selectedCategory || query) && (
          <div className="space-y-10">
            {filteredSections.map((section, sIdx) => (
              <section key={section.title}>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                  <span className="inline-flex items-center gap-2">
                    {logoFor(section.title) ? (<img src={logoFor(section.title)} alt={`${section.title} logo`} className="w-6 h-6 sm:w-7 sm:h-7 object-contain inline-block align-middle" />) : iconFor(section.title)}
                    <span>{section.title}</span>
                  </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, iIdx) => {
                    const key = `${sIdx}-${iIdx}-${item.label}`
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:border-purple-400/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-purple-200">{item.label}</h3>
                            <p className="text-sm text-gray-300 mt-1">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(item.code, key)}
                            className="text-sm px-3 py-1.5 rounded border border-white/20 hover:border-purple-400/50 text-gray-200 hover:text-white"
                            aria-label="Copy code"
                          >
                            {copiedKey === key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="mt-3 p-3 bg-black/40 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words sm:whitespace-pre">
{item.code}
                        </pre>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-black/40 py-8 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <p className="text-gray-400">Updated regularly • Notes & Cheat Sheet</p>
          </div>
        </footer>
      </div>
    </>
  )
}
