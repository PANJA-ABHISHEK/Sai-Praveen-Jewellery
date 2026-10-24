import { getAllProducts, getProductBySlug } from '@/lib/api';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import siteConfig from '@/lib/config';
import { canonicalPath, withCanonical } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Generate static params for all products
export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Dynamic metadata for each product
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : product.images
      ? [product.images]
      : [];

  return withCanonical({
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      ...(images[0]
        ? { images: [{ url: images[0], alt: product.name }] }
        : {}),
    },
  }, `/product/${encodeURIComponent(slug)}`);
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : product.images
      ? [product.images]
      : [];
  const productUrl = canonicalPath(`/product/${encodeURIComponent(product.slug)}`);
  const price = Number(product.price);
  const productSchema = productUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        ...(images.length > 0 ? { image: images } : {}),
        sku: product.slug,
        brand: {
          '@type': 'Brand',
          name: siteConfig.businessName,
        },
        ...(Number.isFinite(price) && price > 0
          ? {
              offers: {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency: siteConfig.currency,
                price,
                availability:
                  product.stockStatus === 'in_stock'
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
            }
          : {}),
      }
    : null;

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailClient product={product} />
    </>
  );
}
