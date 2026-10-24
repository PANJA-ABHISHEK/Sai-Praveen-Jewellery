const instagramUrl = 'https://www.instagram.com/sai_praveen_jewllers_patamata?rpxt=eW1haGMzN2p5b3I%3D&utm_source=qr';
const facebookUrl = 'https://www.facebook.com/596804743513396/';

function InstagramIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient-social" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD600" />
          <stop offset="0.45" stopColor="#FF3B30" />
          <stop offset="1" stopColor="#C13584" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#instagram-gradient-social)" />
      <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.8" />
      <circle cx="16.8" cy="7.3" r="1" fill="white" />
    </svg>
  );
}

function FacebookIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.8v8h2.9Z" fill="white" />
    </svg>
  );
}

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Social media links">
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow Sai Praveen Jewellery on Instagram"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:-translate-y-0.5 hover:border-skj-gold"
      >
        <InstagramIcon />
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow Sai Praveen Jewellery on Facebook"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:-translate-y-0.5 hover:border-skj-gold"
      >
        <FacebookIcon />
      </a>
    </div>
  );
}
