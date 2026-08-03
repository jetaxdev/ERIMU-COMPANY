'use client';

import { MessageCircle } from 'lucide-react';

const whatsappLink = `https://wa.me/254798426336?text=${encodeURIComponent('Hello Erimu Ventures, I would like more details about your properties.')}`;

export function FloatingWhatsAppButton() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-4 z-[95] inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(16,185,129,0.34)] transition hover:bg-emerald-400 active:scale-[0.98] sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}