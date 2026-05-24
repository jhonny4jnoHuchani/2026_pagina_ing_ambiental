import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Header from './components/Layout/Header'
import { ThemeProvider } from 'next-themes'
import Footer from './components/Layout/Footer'
import ScrollToTop from './components/ScrollToTop'
import ColorProvider from './components/ColorProvider'
import FaviconProvider from '@/app/components/FaviconProvider'

const DMSans = DM_Sans({
  variable: '--font-DM-Sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Ingeniería Ambiental',
  description: 'Ingeniería Ambiental',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={`${DMSans.variable} antialiased dark:bg-darkmode`}>
        <ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
          <FaviconProvider />
          <ColorProvider />
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}