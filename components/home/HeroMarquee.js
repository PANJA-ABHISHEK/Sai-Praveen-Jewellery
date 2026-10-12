'use client';

export default function HeroMarquee() {
  const features = [
    '100% HALLMARK CERTIFIED',
    'HANDCRAFTED DESIGNS',
    'PURE 22K GOLD',
    '925 STERLING SILVER',
    'TRUSTED BY 1000+ FAMILIES',
    'EXPERT CRAFTSMANSHIP',
  ];

  return (
    <div className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16 w-full flex flex-col">
      {/* Perfectly matched smooth flowing wave */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px] lg:h-[90px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#FFF9EC"
            fillOpacity="1"
            d="M0,128L80,144C160,160,320,192,480,176C640,160,800,96,960,85.3C1120,75,1280,117,1360,138.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Small ivory gap between curve and marquee */}
      <div className="w-full h-1.5 sm:h-2 lg:h-3 bg-[#FDFBF7]"></div>

      {/* Marquee Bar */}
      <div className="w-full bg-[#121212] border-y border-[#C59B27]/20 text-white py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee items-center">
          {/* Duplicate features array to create a seamless loop */}
          {[...features, ...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-skj-gold mx-6" aria-hidden="true"></span>
              <span 
                className="text-xs sm:text-sm font-semibold tracking-widest uppercase"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </div>
  );
}
