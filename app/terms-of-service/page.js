import Link from 'next/link';
import { withCanonical } from '@/lib/seo';


export const metadata = withCanonical({
  title: 'Terms of Service | Sai Praveen Jewellery',
  description: 'Terms of Service for Sai Praveen Jewellery.',
}, '/terms-of-service');

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-skj-ivory/60">

      <div className="section-container max-w-4xl py-10 lg:py-16">
        <div className="rounded-3xl border border-skj-gold/20 bg-white/95 p-6 shadow-[0_14px_35px_rgba(54,24,29,0.08)] sm:p-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-skj-charcoal mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Terms of Service
        </h1>
        
        <div className="prose prose-skj max-w-none text-skj-muted space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to Sai Praveen Jewellery. By accessing our website, communicating with us via WhatsApp, or purchasing our products, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-xl font-semibold text-skj-charcoal mt-10 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            1. Product Information and Pricing
          </h2>
          <p>
            We strive to display our jewellery collections as accurately as possible. However, actual colours, sizes, and weights may vary slightly due to photography and the handcrafted nature of our products.
          </p>
          <p>
            Gold and silver prices fluctuate based on market rates. The final price of any product will be calculated and communicated to you at the time of placing an order. Making charges and taxes will apply as per standard regulations.
          </p>

          <h2 className="text-xl font-semibold text-skj-charcoal mt-10 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            2. Orders and Payments
          </h2>
          <p>
            Currently, our website serves as a digital catalogue. Orders can be placed by visiting our store at Municipal Complex, M G Road, Patamata, Vijayawada or by contacting us via WhatsApp. Advance payments may be required for custom orders.
          </p>

          <h2 className="text-xl font-semibold text-skj-charcoal mt-10 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            3. Exchange and Returns
          </h2>
          <p>
            We take pride in our authentic craftsmanship and certified purity. However, if you are unsatisfied with your purchase, please consult our store policies on exchanges and returns directly at our Vijayawada store, as conditions may vary based on the type of jewellery purchased.
          </p>

          <h2 className="text-xl font-semibold text-skj-charcoal mt-10 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            4. Changes to Terms
          </h2>
          <p>
            Sai Praveen Jewellery reserves the right to update or modify these Terms of Service at any time without prior notice.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
