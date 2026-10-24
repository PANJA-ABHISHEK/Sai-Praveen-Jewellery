export const PRODUCT_SECTIONS = [
  { id: 'women', label: 'Women', description: 'Jewellery designed for women', hasCategory: true },
  { id: 'men', label: 'Men', description: 'Jewellery designed for men', hasCategory: true },
  { id: 'coins', label: 'Coins', description: 'Gold and silver coins', hasCategory: false },
  { id: 'collections', label: 'Collections', description: 'Gold and silver articles', hasCategory: false },
];

export const PRODUCT_SECTION_IDS = PRODUCT_SECTIONS.map((section) => section.id);

export function getProductSection(productOrSection) {
  if (typeof productOrSection === 'string') {
    return PRODUCT_SECTION_IDS.includes(productOrSection) ? productOrSection : 'women';
  }

  const value = productOrSection?.section || productOrSection?.audience || 'women';
  return PRODUCT_SECTION_IDS.includes(value) ? value : 'women';
}

export function getProductSectionLabel(productOrSection) {
  const section = getProductSection(productOrSection);
  return PRODUCT_SECTIONS.find((item) => item.id === section)?.label || 'Women';
}

export function sectionHasCategory(section) {
  return section === 'women' || section === 'men';
}

export function normalizeProductSection(section, fallback = 'women') {
  return PRODUCT_SECTION_IDS.includes(section) ? section : fallback;
}
