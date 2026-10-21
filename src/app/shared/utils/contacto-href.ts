/**
 * Turns a free-text contact value into a clickable href: URLs open as-is,
 * emails become mailto:, and anything mostly made of digits becomes a
 * WhatsApp link (the usual channel in the community). Returns null when the
 * value doesn't look like any of those, so it's shown as plain text instead.
 */
export function contactoHref(contacto: string): string | null {
  const value = contacto.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;

  const digits = value.replace(/\D/g, '');
  if (digits.length >= 7 && digits.length >= value.replace(/\s/g, '').length - 3) {
    // Colombian mobile numbers are 10 digits; prefix the country code if missing.
    return `https://wa.me/${digits.length === 10 ? '57' + digits : digits}`;
  }
  return null;
}
