import type { Metadata } from 'next'
import './globals.css'
import { sora, inter } from '@/lib/fonts'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Hottubs & Sauna\'s - Premium Wellness Experience',
  description: 'Ontdek onze premium collectie hottubs en sauna\'s. Professioneel advies, snelle levering en uitstekende service.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="logos/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
} 
