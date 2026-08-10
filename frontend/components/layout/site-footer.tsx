'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CompanyProfile, getCompanyProfile } from '@/services/api/company';

const fallbackName = 'Erimu Land Ltd';
const fallbackAbout =
  'We connect you with verified investment plots across Kenya. Transparent pricing, secure ownership, and exceptional customer service.';
const fallbackAddress = 'Kimatthi House, 5th Floor, Kimathi Street, Nairobi, Kenya';
const fallbackPhones = ['+254 723 456 789', '+254 734 567 890'];
const fallbackEmails = ['info@erimuventures.co.ke', 'support@erimuventures.co.ke'];

export function SiteFooter() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    getCompanyProfile()
      .then((result) => {
        if (!mounted) {
          return;
        }

        setCompany(result);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setCompany(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const companyName = company?.name?.trim() || fallbackName;
  const companyAbout = company?.about?.trim() || company?.mission?.trim() || fallbackAbout;
  const companyAddress = company?.address?.trim() || fallbackAddress;

  const phones = useMemo(() => {
    const values = company?.phones?.map((phone) => phone.trim()).filter(Boolean);
    return values && values.length > 0 ? values : fallbackPhones;
  }, [company?.phones]);

  const emails = useMemo(() => {
    const values = company?.emails?.map((email) => email.trim()).filter(Boolean);
    return values && values.length > 0 ? values : fallbackEmails;
  }, [company?.emails]);

  const socialLinks = useMemo(() => {
    const links = company?.socialLinks?.filter((item) => item.url?.trim()) ?? [];
    const seen = new Set<string>();

    return links
      .filter((item) => {
        const platform = item.platform?.trim() ?? '';
        const url = item.url?.trim() ?? '';

        if (/instagram/i.test(platform) || /instagram/i.test(url)) {
          return false;
        }

        if (/facebook/i.test(platform) || /facebook/i.test(url)) {
          if (seen.has('facebook')) {
            return false;
          }

          seen.add('facebook');
          return true;
        }

        const key = `${platform.toLowerCase()}:${url}`;
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 4);
  }, [company?.socialLinks]);

  const hasFacebookLink = useMemo(
    () => socialLinks.some((link) => /facebook/i.test(link.platform || link.url || '')),
    [socialLinks],
  );

  return (
    <footer id="contact" className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
        <div>
          <Image
            src="/erimuland%20logo.png"
            alt={companyName}
            width={150}
            height={56}
            className="h-14 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">{companyAbout}</p>

          <div className="mt-5 flex gap-3 text-slate-300">
            {socialLinks.map((link) => (
              <a
                key={`${link.platform}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-white"
              >
                {link.platform}
              </a>
            ))}

            <a
              href="https://www.tiktok.com/@erimulandltd"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-white"
            >
              TikTok
            </a>

            {!hasFacebookLink && (
              <a
                href="https://www.facebook.com/erimuventures"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:text-white"
              >
                Facebook
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><Link href="/" className="transition hover:text-white">Home</Link></li>
            <li><Link href="/properties" className="transition hover:text-white">Properties</Link></li>
            <li><Link href="/about" className="transition hover:text-white">About Us</Link></li>
            <li><Link href="/services" className="transition hover:text-white">Services</Link></li>
            <li><Link href="/gallery" className="transition hover:text-white">Gallery</Link></li>
            <li><Link href="/testimonials" className="transition hover:text-white">Testimonials</Link></li>
            <li><Link href="/contact#contact-form" className="transition hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Our Services</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Land Selling</li>
            <li>Site Visits</li>
            <li>Land Verification</li>
            <li>Payment Plans</li>
            <li>Title Processing</li>
            <li>Customer Support</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <ul className="mt-4 space-y-4 text-sm text-slate-300">
            <li>{companyAddress}</li>
            <li>
              {phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className="block transition hover:text-white">
                  {phone}
                </a>
              ))}
            </li>
            <li>
              {emails.map((email) => (
                <a key={email} href={`mailto:${email}`} className="block transition hover:text-white">
                  {email}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>{`© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}</p>
        <div className="flex gap-4">
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/contact#contact-form" className="transition hover:text-white">Get in Touch</Link>
        </div>
      </div>
    </footer>
  );
}
