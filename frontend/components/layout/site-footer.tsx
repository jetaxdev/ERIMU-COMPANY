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

  const socialLinks = useMemo(
    () => company?.socialLinks?.filter((item) => item.url?.trim()).slice(0, 4) ?? [],
    [company?.socialLinks],
  );

  return (
    <footer id="contact" className="bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <Image
          src="/erimuland%20logo.png"
          alt={companyName}
          width={150}
          height={56}
          className="h-12 w-auto object-contain brightness-0 invert"
        />

        <div className="mt-2 flex items-center gap-5">
          <a
            href="https://www.tiktok.com/@erimulandltd"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-slate-200 hover:text-white"
          >
            TikTok
          </a>

          <a
            href="https://www.facebook.com/erimuventures"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-slate-200 hover:text-white"
          >
            Facebook
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-400">{`© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}</p>
      </div>
    </footer>
  );
}
