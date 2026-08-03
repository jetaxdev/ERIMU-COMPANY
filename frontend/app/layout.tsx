import type { Metadata } from 'next';
import { FloatingWhatsAppButton } from '@/components/common/floating-whatsapp-button';
import './globals.css';

export const metadata: Metadata = {
  title: 'ERIMU Company',
  description: 'Modern property and real-estate platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
