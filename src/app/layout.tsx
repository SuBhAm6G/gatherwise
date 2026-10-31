import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ConnectivityIndicator } from '@/components/ui/ConnectivityIndicator'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GatherWise — Adaptive GenAI-Powered Event Planning Assistant',
  description:
    'Plan less chaotically. Celebrate more confidently. Deterministic budget & timeline engines with grounded Gemini intelligence.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#070814] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <ConnectivityIndicator />
      </body>
    </html>
  )
}
