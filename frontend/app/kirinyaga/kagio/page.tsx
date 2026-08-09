import { CategoryLandingPage } from '@/components/seo/CategoryLandingPage';
import { fetchPropertiesServer } from '@/lib/api-server';

export const revalidate = 60;

export default async function KagioPage() {
  const properties = await fetchPropertiesServer({ town: 'Kagio', limit: 12 });

  return (
    <CategoryLandingPage
      headline="Plots for Sale in Kagio"
      intro="Explore available land in Kagio with verified documentation and convenient access to local amenities."
      summary="Kagio offers strategic locations for residential and investment plots — view current listings below."
      locationPhrase="Kagio"
      properties={properties}
      relatedLinks={[{ href: '/kirinyaga', label: 'Kirinyaga listings' }, { href: '/kirinyaga/kutus', label: 'Kutus listings' }]}
      faq={[{ question: 'Can I reserve a plot?', answer: 'Yes — contact us to reserve and pay a holding deposit.' }]}
      pagePath="/kirinyaga/kagio"
    />
  );
}
