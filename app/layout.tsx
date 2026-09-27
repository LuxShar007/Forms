// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070712',
};

export const metadata: Metadata = {
  title: 'Music Experience Survey',
  description:
    'A simple questionnaire to understand how people listen to music, discover songs, and what frustrates them about current music platforms.',
  keywords: ['music research', 'music experience', 'music study', 'survey', 'form'],
  openGraph: {
    title: 'Music Experience Survey',
    description: 'Share your music listening experience.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
