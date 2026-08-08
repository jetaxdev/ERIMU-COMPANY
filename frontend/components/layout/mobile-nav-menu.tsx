'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';

type MobileNavMenuProps = {
  currentPath?: string;
};

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact Us', href: '/contact' },
];

export function MobileNavMenu({ currentPath }: MobileNavMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const normalizedPath = useMemo(() => {
    const sourcePath = pathname || currentPath || '';

    if (!sourcePath) {
      return '';
    }

    return sourcePath === '/' ? '/' : sourcePath.replace(/\/$/, '');
  }, [currentPath, pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="public-mobile-nav-drawer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-600 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.35)] transition active:scale-[0.98] lg:hidden"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[90]" aria-hidden={!isOpen}>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />

          <aside
            id="public-mobile-nav-drawer"
            className="absolute right-0 top-0 z-[91] ml-auto flex h-[100dvh] w-[min(82vw,20rem)] flex-col overflow-hidden border-l border-slate-200 bg-white text-slate-900 shadow-[-18px_0_40px_rgba(15,23,42,0.18)] sm:w-[22rem]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                  <Image src="/erimuland%20logo.png" alt="Erimu Land Ltd logo" fill className="object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Erimu Land Ltd</p>
                  <p className="text-sm font-semibold text-slate-800">Navigation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
              {navItems.map((item) => {
                const path = item.href === '/' ? '/' : item.href.replace(/\/$/, '');
                const isActive = normalizedPath
                  ? normalizedPath === path || (path !== '/' && normalizedPath.startsWith(`${path}/`))
                  : false;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group inline-flex min-h-11 touch-manipulation items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${
                      isActive
                        ? 'border-red-400/80 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.2)]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`h-4 w-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  </Link>
                );
              })}

              <Link
                href="/contact#contact-form"
                onClick={() => setIsOpen(false)}
                className="mt-1 inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition active:scale-[0.99] hover:bg-blue-700"
              >
                Book Site Visit
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
