import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bureau Console - Auto-Enrolment',
  description: 'Irish Auto-Enrolment Bureau Console',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
