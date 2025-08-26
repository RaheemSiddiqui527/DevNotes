// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Developer Notes & Cheat Sheet - Quick References for Daily Dev Work',
  description: 'Comprehensive developer cheat sheets and local library for PDFs. Git, Docker, React, Next.js commands and snippets at your fingertips.',
  keywords: 'developer cheat sheet, git commands, docker snippets, react patterns, next.js examples, programming reference',
  robots: 'index, follow',
  openGraph: {
    title: 'Developer Notes & Cheat Sheet',
    description: 'Quick references and snippets for daily dev work. Local library included.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}