// src/app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "DevNotes - Developer Cheat Sheets & Local Library",
  description:
    "DevNotes is your go-to resource for Git, Docker, React, Next.js, MongoDB cheat sheets and a private local library. Search, copy, and boost your productivity — all stored securely in your browser.",
  keywords: [
    "DevNotes",
    "developer notes",
    "git cheatsheet",
    "react snippets",
    "docker commands",
    "next.js tips",
    "mongodb queries",
    "local library",
    "privacy first notes",
  ],
  verification: {
    google:"IkzMs-iymGtdkGAk-ai5P6-sYaSM7KjGDRpEoopc9_4" , // ✅ correct way
  },
  authors: [{ name: "DevNotes" }],
  creator: "DevNotes",
  publisher: "DevNotes",
  openGraph: {
    title: "DevNotes - Developer Cheat Sheets & Local Library",
    description:
      "Cheat sheets, code snippets, and a private library. Built for developers who value speed and privacy.",
    url: "https://devnotes.site.vercel.app", // change to your domain
    siteName: "DevNotes",
    images: [
      {
        url: "https://devnotes.site.vercel.app/og-image.png", // add a preview image in /public
        width: 1200,
        height: 630,
        alt: "DevNotes Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevNotes - Developer Cheat Sheets & Local Library",
    description:
      "Your go-to resource for quick developer references. Store notes locally, no servers, no tracking.",
    creator: "@codewithraheem", // optional
    images: ["https://devnotes.site.vercel.app/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
