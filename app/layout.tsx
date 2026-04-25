import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AROYA · High Rollers aW — The science behind the smoke',
  description:
    'Live water activity readings for High Rollers 2026 contestant samples, measured by AROYA.',
  openGraph: {
    title: 'AROYA · High Rollers aW',
    description: 'The science behind the smoke. Live aW readings.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1c2632',
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
