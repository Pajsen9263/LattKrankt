import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lättkränkthetrapport',
  description: 'Har du blivit kränkt? Rapportera här!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
