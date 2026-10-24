const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');

function isProductionSiteUrl(value) {
  if (!value) return false;

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function getSiteUrl() {
  return isProductionSiteUrl(configuredSiteUrl) ? configuredSiteUrl : '';
}

export function canonicalPath(pathname) {
  const siteUrl = getSiteUrl();
  return siteUrl ? new URL(pathname, `${siteUrl}/`).toString() : undefined;
}

export function withCanonical(metadata, pathname) {
  const canonical = canonicalPath(pathname);

  if (!canonical) return metadata;

  return {
    ...metadata,
    alternates: {
      ...(metadata.alternates || {}),
      canonical,
    },
  };
}
