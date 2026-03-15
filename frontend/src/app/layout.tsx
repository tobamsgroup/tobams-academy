import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '600', '700', '800', '900'],
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
      <body className={`${nunitoSans.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
