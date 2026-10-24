/**
 * Sai Praveen Jewellery — Business Configuration
 * All client-specific details in one place for easy updates.
 */

const siteConfig = {
  businessName: 'Sai Praveen Jewellery',
  shortName: 'SPJ',
  tagline: 'Timeless Luxury, Crafted with Pure Devotion',
  description:
    'Explore Sai Praveen Jewellery in Patamata, Vijayawada. Discover gold and silver jewellery collections, view our showroom, find directions and contact us for enquiries.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',

  // Contact — replace with verified client details
  phone: '+91 79936 12666',
  whatsappNumber: '919642273707', // Digits only, with country code
  email: 'info@saipraveenjewellery.com',

  // Showroom address
  address: {
    line1: 'Door No: 58-227/1, Municipal Complex',
    line2: 'M.G. Road, Patamata Center',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '520010',
    country: 'India',
  },

  // Business hours — to be confirmed
  hours: {
    weekdays: '10:00 AM – 9:00 PM',
    weekends: '10:00 AM – 9:00 PM',
    closed: null,
  },

  // Social links confirmed for the current business profiles.
  social: {
    instagram: 'https://www.instagram.com/sai_praveen_jewllers_patamata?rpxt=eW1haGMzN2p5b3I%3D&utm_source=qr',
    facebook: 'https://www.facebook.com/596804743513396/',
    youtube: '#',
  },

  // Brand colours (Regal Gold, Obsidian Black, Champagne Ivory)
  colors: {
    red: '#B5223E',
    olive: '#A8741D', // Legacy key: antique champagne gold
    deepOlive: '#35141E', // Legacy key: deep jewellery wine
    gold: '#D9AA3D', // Radiant champagne gold
    ivory: '#FCF8F1', // Warm pearl
    charcoal: '#211719',
    muted: '#746866',
    border: '#E8D8C6',
  },

  currency: 'INR',
  currencySymbol: '₹',
};

export default siteConfig;
