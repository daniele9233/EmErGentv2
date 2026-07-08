import { invariant } from './assert.js';

const COMBINING_MARKS = /[\u0300-\u036f]/g;

/**
 * Converts arbitrary text into a URL-safe slug: lowercase ASCII letters,
 * digits and single hyphens. Diacritics are stripped via NFKD normalization.
 */
export function slugify(input: string, maxLength = 80): string {
  invariant(maxLength >= 1, 'maxLength must be >= 1');

  const slug = input
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length <= maxLength) {
    return slug;
  }
  return slug.slice(0, maxLength).replace(/-+$/g, '');
}

/**
 * Truncates to `maxLength` characters overall, appending the ellipsis when
 * the input had to be cut.
 */
export function truncate(input: string, maxLength: number, ellipsis = '…'): string {
  invariant(maxLength >= ellipsis.length, 'maxLength must fit the ellipsis');

  if (input.length <= maxLength) {
    return input;
  }
  return input.slice(0, maxLength - ellipsis.length) + ellipsis;
}
