export const siteName = 'Erimu Properties';
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://erimuproperties.com';
export const siteDescription =
  'Erimu Properties offers verified land and plot listings in Kirinyaga County, Kenya. Find affordable land, plots, and secure property investments with trusted local support.';

export const kirinyagaTowns = [
  'Kandongu',
  'Kangaru',
  'Thumaita',
  'Sagana',
  'Kangai',
  'Muthatura',
  'Kimisha',
  'Njegas',
  'Kirimunge',
  'Kiaga',
  'Kathaka',
  'Baricho',
] as const;

export type KirinyagaTown = (typeof kirinyagaTowns)[number];

function buildLocationKeywordPhrases(name: string) {
  return [
    `land for sale in ${name}`,
    `plots for sale in ${name}`,
    `property for sale in ${name}`,
    `plot for sale in ${name}`,
    `land in ${name}`,
    `plots in ${name}`,
    `property in ${name}`,
    `vacant land in ${name}`,
    `cheap land in ${name}`,
    `affordable land in ${name}`,
    `investment land in ${name}`,
    `buy land in ${name}`,
  ];
}

export function buildLocationKeywords(location: string) {
  const normalized = location
    .trim()
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
  return buildLocationKeywordPhrases(normalized);
}

const baseKeywords = [
  'land for sale in Kirinyaga',
  'plots for sale in Kirinyaga',
  'property for sale in Kirinyaga',
  'land in Kirinyaga',
  'plots in Kirinyaga',
  'property in Kirinyaga',
  'land for sale in Kutus',
  'plots for sale in Kutus',
  'property for sale in Kutus',
  'land for sale in Kagio',
  'plots for sale in Kagio',
  'affordable land in Kirinyaga',
];

export const siteKeywords = Array.from(
  new Set([
    ...baseKeywords,
    ...buildLocationKeywords('Kirinyaga'),
    ...kirinyagaTowns.flatMap(buildLocationKeywords),
  ]),
);

export const socialImage = `${siteUrl}/erimuland%20logo.png`;
export const defaultTitle = 'Erimu Properties | Land & Plots for Sale in Kirinyaga, Kenya';
