import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Haifa FC Manager',
  description: 'מנהל קבוצת מכבי חיפה - ניהול שחקנים, אימונים ומשחקים',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Navigation />
        <main className="min-h-screen pb-8">
          {children}
        </main>
      </body>
    </html>
  )
}

