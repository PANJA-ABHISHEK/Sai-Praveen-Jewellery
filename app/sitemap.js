import { collection, getDocs } from 'firebase/firestore';
import { getCategorySlug } from '@/data/categories';
import categories from '@/data/categories';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import { getSiteUrl } from '@/lib/seo';

export const revalidate = 3600;

const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/gold/women',
  '/gold/men',
  '/gold/collections',
  '/gold/coins',
  '/silver/women',
  '/silver/men',
  '/silver/collections',
  '/silver/coins',
  '/schemes',
  '/privacy-policy',
  '/terms-of-service',
];

function toUrl(siteUrl, pathname) {
  return new URL(pathname, `${siteUrl}/`).toString();
}

function toDate(value) {
  if (!value) return undefined;
  if (typeof value?.toDate === 'function') return value.toDate();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const entries = publicRoutes.map((pathname) => ({
    url: toUrl(siteUrl, pathname),
    changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
    priority: pathname === '/' ? 1 : 0.7,
  }));

  try {
    const snapshot = await withFirestoreTimeout(() =>
      getDocs(collection(db, 'products'))
    );
    const products = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    const categorySlugs = new Set(
      products.map((product) => getCategorySlug(product.category)).filter(Boolean)
    );

    for (const category of categories) {
      if (categorySlugs.has(category.slug)) {
        entries.push({
          url: toUrl(siteUrl, `/category/${category.slug}`),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }

    for (const product of products) {
      if (!product.slug) continue;

      const entry = {
        url: toUrl(siteUrl, `/product/${encodeURIComponent(product.slug)}`),
        changeFrequency: 'weekly',
        priority: 0.6,
      };
      const lastModified = toDate(product.updatedAt || product.createdAt);
      if (lastModified) entry.lastModified = lastModified;
      entries.push(entry);
    }
  } catch (error) {
    console.warn('Unable to load product URLs for sitemap:', error);
  }

  return entries;
}
