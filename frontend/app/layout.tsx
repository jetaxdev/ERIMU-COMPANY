import type { Metadata } from 'next';
import { ConditionalWhatsAppButton } from '@/components/common/conditional-whatsapp-button';
import './globals.css';

export const metadata: Metadata = {
  title: 'ERIMU Land Ltd',
  description: 'Best land selling company in Kirinyaga County.Try us today',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConditionalWhatsAppButton />
      </body>
    </html>
  );
}
