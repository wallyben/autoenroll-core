import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auto-Enrolment Orchestrator',
  description: 'Irish Auto-Enrolment SaaS Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
