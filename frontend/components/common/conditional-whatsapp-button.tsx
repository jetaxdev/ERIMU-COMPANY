'use client';

import { usePathname } from 'next/navigation';
import { FloatingWhatsAppButton } from './floating-whatsapp-button';

export function ConditionalWhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <FloatingWhatsAppButton />;
}
