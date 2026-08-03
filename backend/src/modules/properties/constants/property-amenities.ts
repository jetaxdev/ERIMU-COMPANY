export const PROPERTY_AMENITIES = [
  'WATER',
  'ELECTRICITY',
  'SCHOOLS',
  'HOSPITALS',
  'ROAD',
  'TITLE_DEED',
  'FENCE',
  'BEACONED',
] as const;

export type PropertyAmenityName = (typeof PROPERTY_AMENITIES)[number];
