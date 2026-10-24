import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CatalogueView from '@/components/catalogue/CatalogueView';
import categories, { getCategoryBySlug } from '@/data/categories';
import { withCanonical } from '@/lib/seo';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return withCanonical({
    title: `${category.name} Jewellery`,
    description: `Explore gold and silver ${category.name.toLowerCase()} designs for women and men.`,
  }, `/category/${category.slug}`);
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueView categoryName={category.name} />
    </Suspense>
  );
}

function CatalogueLoading() {
  return <div className="section-container min-h-[60vh] py-20" />;
}
