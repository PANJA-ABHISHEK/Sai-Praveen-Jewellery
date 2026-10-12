/**
 * Sai Praveen Jewellery — Business Configuration
 * All client-specific details in one place for easy updates.
 */

const siteConfig = {
  businessName: 'Sai Praveen Jewellery',
  shortName: 'SPJ',
  tagline: 'Timeless Luxury, Crafted with Pure Devotion',
  description:
    'Discover exquisite gold, silver, and diamond jewellery at Sai Praveen Jewellery. Browse our curated collections of necklaces, bangles, rings, earrings and more.',
  siteUrl: 'https://saipraveenjewellery.com',

  // Contact — replace with verified client details
  phone: '+91 95056 08181',
  whatsappNumber: '919505608181', // Digits only, with country code
  email: 'info@saipraveenjewellery.com',

  // Showroom address — to be confirmed by client
  address: {
    line1: 'Shop No. 20, MGM Complex',
    line2: 'Market Road, Maruthi Nagar',
    city: 'Ravulapalem',
    state: 'Andhra Pradesh',
    pincode: '533238',
    country: 'India',
  },

  // Business hours — to be confirmed
  hours: {
    weekdays: '10:00 AM – 9:00 PM',
    weekends: '10:00 AM – 9:00 PM',
    closed: null,
  },

  // Social links — add actual URLs when confirmed
  social: {
    instagram: '#',
    facebook: '#',
    youtube: '#',
  },

  // Brand colours (Regal Gold, Obsidian Black, Champagne Ivory)
  colors: {
    red: '#C41E3A',
    olive: '#C59B27', // Royal 22K Gold
    deepOlive: '#121212', // Obsidian Luxury Black
    gold: '#DFB235', // Radiant Accent Gold
    ivory: '#FDFBF7', // Champagne Pearl
    charcoal: '#141414',
    muted: '#6E6B65',
    border: '#EADBCA',
  },

  currency: 'INR',
  currencySymbol: '₹',
};

export default siteConfig;
