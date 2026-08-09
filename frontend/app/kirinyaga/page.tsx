import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';

export const revalidate = 60; // regenerate often for fresh listings

export default async function KirinyagaPage() {
  const properties = await fetchPropertiesServer({ county: 'Kirinyaga', limit: 12 });

  return (
    <CategoryLandingPage
      headline="Land & Plots for Sale in Kirinyaga"
      intro="Explore verified land for sale across Kirinyaga County, including Kutus and Kagio. Find secure investments with transparent documentation."
      summary="Erimu Properties lists verified plots with clear titles, competitive pricing, and flexible payment plans in Kirinyaga County."
      locationPhrase="Kirinyaga County"
      properties={properties}
      relatedLinks={[{ href: '/kirinyaga/kutus', label: 'Kutus properties' }, { href: '/kirinyaga/kagio', label: 'Kagio properties' }]}
      faq={[
        { question: 'Are plots verified?', answer: 'Yes — we verify titles and ownership before listing.' },
        { question: 'Can I schedule a site visit?', answer: 'Yes — book a visit from the property page or contact us directly.' },
      ]}
      pagePath="/kirinyaga"
    />
  );
}
