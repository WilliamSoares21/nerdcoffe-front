import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { AuthProvider } from '@/lib/auth-context'
import { Header } from '@/components/header'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'morning.dev - Seu briefing tech matinal',
  description: 'Uma curadoria diária das melhores notícias, artigos e discussões do mundo dev. Feito para desenvolvedores que querem começar o dia informados.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { Toaster } from '@/components/ui/sonner'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialSession = !!cookieStore.get("auth_token")?.value
  const userCookie = cookieStore.get("auth_user")?.value
  
  let initialUser = null
  if (userCookie) {
    try {
      initialUser = JSON.parse(userCookie)
    } catch (e) {
      console.warn("RootLayout: failed to parse auth_user cookie", e)
    }
  }

  return (
    <html lang="pt-BR" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider initialSession={initialSession} initialUser={initialUser}>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
