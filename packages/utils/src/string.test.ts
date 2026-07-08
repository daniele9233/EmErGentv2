import { describe, expect, it } from 'vitest';

import { slugify, truncate } from './string.js';

describe('slugify', () => {
  it('lowercases and hyphenates words', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('strips diacritics', () => {
    expect(slugify('Città è già così')).toBe('citta-e-gia-cosi');
  });

  it('collapses consecutive separators and trims edges', () => {
    expect(slugify('  --My   App__v2--  ')).toBe('my-app-v2');
  });

  it('returns an empty string when nothing survives', () => {
    expect(slugify('!!!')).toBe('');
  });

  it('respects maxLength without leaving a trailing hyphen', () => {
    expect(slugify('alpha beta gamma', 11)).toBe('alpha-beta');
  });
});

describe('truncate', () => {
  it('returns short strings unchanged', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('cuts long strings and appends the ellipsis within maxLength', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
    expect(truncate('abcdefghij', 5)).toHaveLength(5);
  });

  it('supports a custom ellipsis', () => {
    expect(truncate('abcdefghij', 6, '...')).toBe('abc...');
  });

  it('rejects a maxLength smaller than the ellipsis', () => {
    expect(() => truncate('abc', 0)).toThrow('Invariant violation');
  });
});
