import siteConfig from '@/lib/config';
import { STATIC_MEDIA } from '@/data/media';
import { getSiteUrl } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export default function BusinessJsonLd() {
  const siteUrl = getSiteUrl();

  if (!siteUrl) return null;

  const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook].filter(
    (url) => url && url !== '#'
  );

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'JewelryStore',
        '@id': `${siteUrl}/#business`,
        name: siteConfig.businessName,
        url: siteUrl,
        image: STATIC_MEDIA.logo,
        telephone: siteConfig.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
          addressLocality: siteConfig.address.city,
          addressRegion: siteConfig.address.state,
          postalCode: siteConfig.address.pincode,
          addressCountry: siteConfig.address.country,
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      }}
    />
  );
}
