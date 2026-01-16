import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'LoanApp.co.ke - Compare Loan Apps in Kenya | Find the Cheapest Rates',
  description: 'Compare interest rates, limits, and terms across 12+ loan apps in Kenya. Calculate exactly what you\'ll pay back with M-Shwari, Tala, Branch, Fuliza, Hustler Fund, and more.',
  keywords: 'loan apps Kenya, M-Pesa loans, Tala, Branch, M-Shwari, Fuliza, Hustler Fund, KCB M-Pesa, loan comparison Kenya, cheapest loans Kenya',
  openGraph: {
    title: 'LoanApp.co.ke - Compare Loan Apps in Kenya',
    description: 'Find the cheapest loan in Kenya. Compare interest rates across 12+ apps.',
    type: 'website',
    locale: 'en_KE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <GoogleAnalytics gaId="G-HTYKMZEF2Z" />
      </body>
    </html>
  );
}
