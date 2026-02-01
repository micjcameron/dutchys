import type { Metadata } from 'next'
import './globals.css'
import { sora, inter } from '@/lib/fonts'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Hottubs & Sauna\'s - Premium Wellness Experience',
  description: 'Ontdek onze premium collectie hottubs en sauna\'s. Professioneel advies, snelle levering en uitstekende service.',
}

const isWebsiteActive = (() => {
  const raw = process.env.NEXT_PUBLIC_IS_WEBSITE_ACTIVE;
  return raw === 'true' || raw === '1';
})();

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
        {isWebsiteActive ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white/90 p-10 text-center shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Onderhoud
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-brand-blue sm:text-4xl">
                Momenteel in onderhoud
              </h1>
              <p className="mt-4 text-base text-gray-600">
                We voeren op dit moment updates uit. Kom later nog eens terug.
              </p>
            </div>
          </div>
        )}
      </body>
    </html>
  )
} 
