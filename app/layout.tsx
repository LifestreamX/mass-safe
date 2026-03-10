import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MassSafe - Find Safer Places to Live in Massachusetts',
  description:
    'Evaluate Massachusetts city and town safety with crime statistics, safety scores, and data visualizations before renting or buying a home.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}
      >
        <Providers>
          <Header />
          <main className='flex-grow'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
