import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { cn } from '@/lib/utils'
import { ChatProvider } from '@/lib/chat-context'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import { ArtifactPanel } from '@/components/artifact-panel'
import { Toaster } from 'sonner'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Deep Counsel AI Chat'
const description =
  'Intelligent legal AI chat interface with beautiful design and powerful artifact capabilities.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen flex flex-col font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 relative">
                {children}
                <ArtifactPanel />
              </main>
            </div>
            <Toaster />
          </ChatProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
