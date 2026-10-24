/**
 * Default scheme shown until the admin saves schemes in Firestore.
 * The values can be edited from the admin Schemes page.
 */
export const DEFAULT_SCHEMES = [
  {
    id: 'easy-gold-payment-monthly',
    name: 'Easy Gold Payment - Monthly',
    description: 'Flexible monthly savings for everyone.',
    schemeType: 'monthly',
    minAmount: 1000,
    durationMonths: 12,
    bonusText: 'Complete the scheme to receive one additional installment benefit.',
    redemptionText: 'Use the accumulated amount for jewellery purchase in the 13th month.',
    benefits: [
      'Monthly installments starting from ₹1,000',
      'One additional installment benefit after completion',
      'Purchase jewellery after the scheme period',
      'Gold jewellery purchase only; cash payout is not available',
    ],
    terms: [
      'Pay the selected installment every month for 12 months.',
      'The benefit can be used towards jewellery purchase after completing the scheme.',
      'If the scheme is stopped early, the additional benefit will not apply.',
      'Please bring the scheme card when making an installment payment.',
    ],
    status: 'published',
    featured: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

export const SCHEME_WHATSAPP_NUMBER = '919642273707';
