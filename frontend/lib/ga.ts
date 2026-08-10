export const GA_MEASUREMENT_ID = 'G-MZ7EWHL8ZF';

declare global {
  interface Window {
    dataLayer: Array<unknown>;
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: url,
  });
};
