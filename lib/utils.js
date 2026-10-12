/**
 * Sri Kankatala Jewellers — Utility Functions
 */

/**
 * Format price in Indian Rupees.
 */
export function formatPrice(price) {
  if (price == null || isNaN(price)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format weight in grams.
 */
export function formatWeight(grams) {
  if (grams == null) return '';
  return `${grams}g`;
}

/**
 * Generate WhatsApp URL with an encoded message.
 */
export function generateWhatsAppURL(phoneNumber, message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

/**
 * Build a WhatsApp order message from cart items and customer details.
 */
export function buildOrderMessage(cartItems, customer) {
  let msg = `🛍️ *Order Enquiry — Sai Praveen Jewellery*\n\n`;
  msg += `*Customer Details*\n`;
  msg += `Name: ${customer.name}\n`;
  msg += `Phone: ${customer.phone}\n`;
  msg += `Delivery Address: ${customer.deliveryAddress}\n`;
  msg += `PIN Code: ${customer.pinCode}\n\n`;
  msg += `*Order Items*\n`;
  msg += `${'─'.repeat(30)}\n`;

  let subtotal = 0;
  cartItems.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    msg += `${index + 1}. ${item.name}\n`;
    msg += `   ID: ${item.id}\n`;
    msg += `   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(lineTotal)}\n`;
    if (index < cartItems.length - 1) msg += `\n`;
  });

  msg += `${'─'.repeat(30)}\n`;
  msg += `*Estimated Subtotal: ${formatPrice(subtotal)}*\n\n`;
  msg += `⚠️ _Note: This is an enquiry, not a confirmed order. Final pricing and stock availability will be confirmed by Sai Praveen Jewellery._`;

  return msg;
}

/**
 * Validate Indian phone number (basic check).
 */
export function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+91|91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Capitalize first letter.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to a max length.
 */
export function truncate(str, max = 100) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).trim() + '…';
}

/**
 * Combine class names (utility for conditional classes).
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
