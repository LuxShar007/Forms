// app/page.tsx
// Public research landing page

import type { Metadata } from 'next';
import Link from 'next/link';
import LandingPageClient from '@/components/LandingPageClient';

export const metadata: Metadata = {
  title: 'Music Experience Survey',
  description:
    'A simple questionnaire to understand how people listen to music, discover new artists, and what frustrates them about current music platforms.',
};

export default function HomePage() {
  return <LandingPageClient />;
}
