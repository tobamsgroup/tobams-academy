import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Tobams Academy',
  description: 'Professional training courses to advance your career',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${roboto.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
