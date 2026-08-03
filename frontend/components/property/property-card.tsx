import Link from 'next/link';
import { Heart, MapPin, Ruler } from 'lucide-react';

export type PropertyCardStatus = 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'COMING_SOON';

export type PropertyCardProps = {
  title: string;
  slug: string;
  location: string;
  county?: string | null;
  price?: number | null;
  discountPrice?: number | null;
  size: string;
  status: PropertyCardStatus;
  featuredImage: string;
  amenities: string[];
  featured?: boolean;
  detailsHref?: string;
};

function formatKES(price?: number | null) {
  if (!price) return 'Contact for price';
  return `KES ${new Intl.NumberFormat('en-KE').format(price)}`;
}

function normalizeLocation(location: string, county?: string | null) {
  if (!county) return location;
  if (location.toLowerCase().includes(county.toLowerCase())) return location;
  return `${location}, ${county}`;
}

function statusLabel(status: PropertyCardStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'Available';
    case 'SOLD':
      return 'Sold';
    case 'RESERVED':
      return 'Reserved';
    case 'COMING_SOON':
      return 'Coming Soon';
    default:
      return status;
  }
}

function statusClass(status: PropertyCardStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-[#1D4ED8]';
    case 'SOLD':
      return 'bg-[#EF4444]';
    case 'RESERVED':
      return 'bg-[#F59E0B]';
    case 'COMING_SOON':
      return 'bg-[#7C3AED]';
    default:
      return 'bg-[#1E2D8F]';
  }
}

export function PropertyCard({
  title,
  slug,
  location,
  county,
  price,
  discountPrice,
  size,
  status,
  featuredImage,
  detailsHref,
}: PropertyCardProps) {
  const hasDiscount = !!discountPrice && !!price && discountPrice < price;
  const locationText = normalizeLocation(location, county);

  return (
    <article
      className="group w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="relative aspect-[1.68/1] overflow-hidden rounded-t-xl sm:aspect-[1.95/1]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.34) 100%), url(${featuredImage})`,
          }}
        />

        <span
          className={`absolute left-2.5 top-2.5 rounded-[4px] px-2 py-1 text-[10px] font-bold uppercase leading-none tracking-wide text-white ${statusClass(
            status,
          )}`}
        >
          {statusLabel(status)}
        </span>

        <button
          type="button"
          aria-label={`Save ${title}`}
          className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:text-[#FF1E28]"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2.5 p-3.5 sm:p-4">
        <div className="space-y-1">
          <h3
            className="text-base font-bold leading-6 text-[#1F2937] sm:text-[17px]"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          <div className="flex items-start gap-1 text-[11px] font-medium leading-5 text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span className="break-words">{locationText}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
            <Ruler className="h-3.5 w-3.5 text-[#64748B]" />
            <span>{size}</span>
          </div>
        </div>

        <div className="space-y-0">
          <p className="text-lg font-bold leading-6 text-[#1D4ED8] sm:text-xl">{formatKES(hasDiscount ? discountPrice : price)}</p>
          {hasDiscount ? <p className="text-xs font-medium text-slate-400 line-through">{formatKES(price)}</p> : null}
        </div>

        <Link
          href={detailsHref || `/properties/${slug}`}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#FF1E28] transition-all duration-300 hover:text-[#e01620]"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
