'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
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

  return (
    <div className="flex flex-col items-end lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-600 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.35)] transition active:scale-[0.98] lg:hidden"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen ? (
        <div className="mt-2 w-[min(88vw,22rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_16px_34px_rgba(15,23,42,0.14)]">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            <p className="text-sm font-semibold text-slate-800">Choose a page</p>
          </div>

          <nav className="flex max-h-[68vh] flex-col gap-1 overflow-y-auto p-2">
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
        </div>
      ) : null}
    </div>
  );
}
