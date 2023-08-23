/**
 * Formats a phone number to the (XXX) XXX-XXXX format.
 *
 * @param {string} phoneNumber - The phone number to be formatted.
 * @returns {string} The formatted phone number or the original input if formatting doesn't match.
 */
export function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber; // Return original if formatting doesn't match
}
// eslint-disable-next-line import/no-anonymous-default-export