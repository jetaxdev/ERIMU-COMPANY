import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';

export const revalidate = 60;

export default async function KutusPage() {
  const properties = await fetchPropertiesServer({ town: 'Kutus', limit: 12 });

  return (
    <CategoryLandingPage
      headline="Plots for Sale in Kutus"
      intro="Browse available plots in Kutus — verified titles, clear boundaries, and competitive pricing."
      summary="Find prime land in Kutus suitable for residential and investment purposes."
      locationPhrase="Kutus"
      properties={properties}
      relatedLinks={[{ href: '/kirinyaga', label: 'Kirinyaga listings' }, { href: '/kirinyaga/kagio', label: 'Kagio listings' }]}
      faq={[{ question: 'How do I pay?', answer: 'We accept full payment or installment plans — contact us for details.' }]}
      pagePath="/kirinyaga/kutus"
    />
  );
}
