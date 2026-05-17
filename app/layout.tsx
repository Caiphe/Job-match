import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobMatch — AI-Powered Job Matching',
  description: 'Upload your CV and let AI find the best matching jobs for your skills.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=document.documentElement;if(s==='dark'||(s===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-text antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
