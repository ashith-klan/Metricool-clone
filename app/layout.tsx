import type { Metadata } from 'next';
import './globals.css';
import { plusJakartaSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'MetricBoard — Social Media Analytics Dashboard',
  description:
    'Responsive social media analytics dashboard with KPI overview, organic vs paid reach performance chart, and competitor benchmarking.',
  openGraph: {
    title: 'MetricBoard — Social Media Analytics Dashboard',
    description:
      'Responsive social media analytics dashboard with KPI overview, organic vs paid reach performance chart, and competitor benchmarking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetricBoard — Social Media Analytics Dashboard',
    description:
      'Responsive social media analytics dashboard with KPI overview, organic vs paid reach performance chart, and competitor benchmarking.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.className} bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
