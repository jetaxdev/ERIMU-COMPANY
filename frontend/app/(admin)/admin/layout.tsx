'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GalleryHorizontal,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Users2,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { DashboardSummary, getDashboardSummary } from '@/services/api/analytics';

type AdminNavItem = {
  label: string;
  href?: string;
  badge?: string;
  notificationCount?: number;
  icon: ReactNode;
};

const mainNavItems: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Properties', href: '/admin/properties', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Gallery', href: '/admin/gallery', icon: <GalleryHorizontal className="h-4 w-4" /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText className="h-4 w-4" /> },
  { label: 'Testimonials', icon: <Users2 className="h-4 w-4" /> },
  { label: 'FAQs', icon: <MessageSquare className="h-4 w-4" /> },
  { label: 'Inquiries', href: '/admin/inquiries', icon: <MessageSquare className="h-4 w-4" /> },
  { label: 'Site Visits', href: '/admin/site-visits', icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Homepage', href: '/admin/homepage', icon: <Home className="h-4 w-4" /> },
  { label: 'Company', href: '/admin/company', icon: <Building2 className="h-4 w-4" /> },
  { label: 'SEO', icon: <Search className="h-4 w-4" /> },
  { label: 'Analytics', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

const footerNavItems: AdminNavItem[] = [
  { label: 'Logout', icon: <LogOut className="h-4 w-4" /> },
];

const adminFont = Manrope({ subsets: ['latin'], variable: '--font-admin' });
const adminBrandFont = Cormorant_Garamond({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-admin-brand' });

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const largeScreenQuery = window.matchMedia('(min-width: 1024px)');

    const updateLayoutMode = () => {
      setIsTouchDevice(touchQuery.matches);
      setIsLargeScreen(largeScreenQuery.matches);
    };

    updateLayoutMode();

    if (typeof touchQuery.addEventListener === 'function') {
      touchQuery.addEventListener('change', updateLayoutMode);
      largeScreenQuery.addEventListener('change', updateLayoutMode);

      return () => {
        touchQuery.removeEventListener('change', updateLayoutMode);
        largeScreenQuery.removeEventListener('change', updateLayoutMode);
      };
    }

    touchQuery.addListener(updateLayoutMode);
    largeScreenQuery.addListener(updateLayoutMode);

    return () => {
      touchQuery.removeListener(updateLayoutMode);
      largeScreenQuery.removeListener(updateLayoutMode);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    getDashboardSummary()
      .then((summary) => {
        if (mounted) {
          setDashboardSummary(summary);
        }
      })
      .catch(() => {
        if (mounted) {
          setDashboardSummary(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const useDrawerSidebar = isTouchDevice || !isLargeScreen;
  const showCollapsedSidebar = !useDrawerSidebar && isSidebarCollapsed;
  const sidebarVisible = useDrawerSidebar ? isSidebarOpen : true;
  const inquiryNotifications = dashboardSummary?.notifications.inquiries ?? 0;
  const siteVisitNotifications = dashboardSummary?.notifications.siteVisits ?? 0;

  const navItems = useMemo(
    () =>
      mainNavItems.map((item) => {
        if (item.label === 'Inquiries') {
          return { ...item, notificationCount: inquiryNotifications };
        }

        if (item.label === 'Site Visits') {
          return { ...item, notificationCount: siteVisitNotifications };
        }

        return item;
      }),
    [inquiryNotifications, siteVisitNotifications],
  );

  const pageLabel = useMemo(() => {
    const current = mainNavItems.find((item) => item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`)));
    return current?.label || 'Dashboard';
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
      router.refresh();
    }
  }

  return (
    <div className={`${adminFont.variable} ${adminBrandFont.variable} h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f7f8fb_0%,#eef1f7_48%,#e8ecf4_100%)] font-[family-name:var(--font-admin)] text-slate-900`}>
      <div className="flex h-full">
        <aside
          className={`no-scrollbar fixed inset-y-0 left-0 z-40 overflow-y-auto overscroll-contain border-r border-amber-100/10 bg-[linear-gradient(198deg,#0f172a_0%,#111c37_38%,#1f2a44_100%)] text-white shadow-[0_24px_58px_rgba(4,11,27,0.46)] transition-all duration-300 lg:shadow-none ${
            useDrawerSidebar ? 'w-72' : showCollapsedSidebar ? 'w-20' : 'w-64'
          } ${
            sidebarVisible ? 'translate-x-0' : '-translate-x-full'
          } ${
            useDrawerSidebar ? '' : 'lg:static lg:translate-x-0'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className={`flex items-center border-b border-white/10 px-4 py-4 ${showCollapsedSidebar ? 'justify-center lg:px-2' : 'justify-between px-4'}`}>
              <div className={`flex items-center gap-3 ${showCollapsedSidebar ? 'lg:flex-col lg:gap-2' : ''}`}>
                <div className="rounded-2xl border border-amber-100/15 bg-white/10 p-1.5 backdrop-blur-xl">
                  <Image
                    src={showCollapsedSidebar ? '/erimu-mark.svg' : '/erimuland%20logo.png'}
                    alt="Erimu Land Ltd"
                    width={showCollapsedSidebar ? 30 : 120}
                    height={showCollapsedSidebar ? 30 : 38}
                    className={showCollapsedSidebar ? 'h-7 w-7' : 'h-auto w-28'}
                    priority
                  />
                </div>
                {!showCollapsedSidebar ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-100/70">ERIMU</p>
                    <h1 className="font-[family-name:var(--font-admin-brand)] text-lg font-semibold tracking-wide text-amber-50">Admin Console</h1>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="hidden rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 hover:text-white lg:inline-flex"
                  onClick={() => setIsSidebarCollapsed((value) => !value)}
                  aria-label={showCollapsedSidebar ? 'Expand sidebar' : 'Collapse sidebar'}
                  hidden={useDrawerSidebar}
                >
                  {showCollapsedSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className={`rounded p-2 text-white/70 hover:bg-white/10 hover:text-white ${useDrawerSidebar ? 'inline-flex' : 'hidden'}`}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <nav className="no-scrollbar flex-1 space-y-4 overflow-y-auto overscroll-contain px-2.5 py-3">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = !!item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`));
                  const notificationCount = item.notificationCount ?? 0;
                  const hasNotification = notificationCount > 0;

                  if (!item.href) {
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center rounded-xl px-2.5 py-2 text-[13px] font-medium text-white/75 ${showCollapsedSidebar ? 'justify-center lg:px-2' : 'gap-2.5'}`}
                        title={item.label}
                      >
                          <span className="relative inline-flex items-center justify-center">
                            {item.icon}
                            {hasNotification ? (
                              <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#111c37]">
                                {notificationCount}
                              </span>
                            ) : null}
                          </span>
                        {!showCollapsedSidebar ? <span className="flex-1">{item.label}</span> : null}
                        {!showCollapsedSidebar && item.badge ? (
                          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">{item.badge}</span>
                        ) : null}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group relative flex items-center rounded-xl px-2.5 py-2 text-[13px] font-medium transition ${showCollapsedSidebar ? 'justify-center lg:px-2' : 'gap-2.5'} ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-400/85 via-orange-300/85 to-amber-200/90 text-slate-900 shadow-[0_14px_36px_rgba(245,184,73,0.28)]'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                      title={item.label}
                    >
                      {!isActive ? <span className="absolute inset-y-1 left-0 w-[2px] rounded-full bg-amber-300/0 transition group-hover:bg-amber-300/80" /> : null}
                      <span className="relative inline-flex items-center justify-center">
                        {item.icon}
                        {hasNotification ? (
                          <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#111c37]">
                            {notificationCount}
                          </span>
                        ) : null}
                      </span>
                      {!showCollapsedSidebar ? <span className="flex-1">{item.label}</span> : null}
                      {!showCollapsedSidebar && item.badge ? (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">{item.badge}</span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-3">
                {footerNavItems.map((item) => {
                  if (item.label === 'Logout') {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={handleLogout}
                        className={`flex w-full items-center rounded-xl px-2.5 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white ${showCollapsedSidebar ? 'justify-center lg:px-2' : 'gap-2.5'}`}
                        title={item.label}
                      >
                        {item.icon}
                        {!showCollapsedSidebar ? <span>{item.label}</span> : null}
                      </button>
                    );
                  }

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {isSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar backdrop"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-3 py-3 backdrop-blur-xl lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className={`hidden rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex ${useDrawerSidebar ? 'hidden' : ''}`}
                  onClick={() => setIsSidebarCollapsed((value) => !value)}
                  aria-label={showCollapsedSidebar ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {showCollapsedSidebar ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <h2 className="text-sm font-semibold text-slate-900 sm:text-lg">{pageLabel}</h2>
              </div>

              <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
                <div className="relative hidden sm:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="h-9 w-56 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none ring-blue-200 transition focus:ring"
                  />
                </div>

                <button
                  type="button"
                  className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">5</span>
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 sm:hidden"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
                  aria-label="Theme"
                >
                  <Moon className="h-4 w-4" />
                </button>

                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm sm:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-slate-800">Admin</p>
                    <p className="text-[11px] text-slate-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-3 sm:hidden">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none ring-blue-200 transition focus:ring"
              />
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto p-3 lg:p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
