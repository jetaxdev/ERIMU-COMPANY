'use client';

import { MessageCircle } from 'lucide-react';
import { useMemo } from 'react';

const primaryContactPhone = '+254798426336';
const primaryContactEmail = 'erimuventures@gmail.com';
const primaryAddress = 'KWFT Building, Kagio Town, Kirinyaga, Kenya';

export function ContactTickerBar() {
  const whatsappLink = `https://wa.me/254798426336?text=${encodeURIComponent('Hello Erimu Land Ltd, I would like more details about your properties.')}`;

  const contactTickerItems = useMemo(
    () => [
      { text: `Call us: ${primaryContactPhone}` },
      { text: `WhatsApp: ${primaryContactPhone}`, href: whatsappLink },
      { text: `Email: ${primaryContactEmail}` },
      { text: `Visit us: ${primaryAddress}` },
      { text: 'Book a site visit today for guided property viewing' },
    ],
    [whatsappLink],
  );

  const scrollingContactItems = useMemo(
    () => [...contactTickerItems, ...contactTickerItems],
    [contactTickerItems],
  );

  return (
    <section className="border-b border-slate-200/70 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-4 py-2.5 sm:px-6 lg:px-8">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="contact-ticker-marquee-track flex w-max items-center gap-8 whitespace-nowrap text-sm text-white/82">
            {scrollingContactItems.map((item, index) => (
              <div key={`${item.text}-${index}`} className="flex items-center gap-8">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-emerald-300"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
                <span className="text-red-400">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes contact-ticker-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .contact-ticker-marquee-track {
          animation: contact-ticker-marquee 26s linear infinite;
        }

        .contact-ticker-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}