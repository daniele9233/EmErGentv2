import { describe, expect, it } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  it('joins plain strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('skips falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('supports conditional expressions', () => {
    const isEnabled = (flag: string): boolean => flag === 'active';

    expect(cn('base', isEnabled('active') && 'active', isEnabled('disabled') && 'disabled')).toBe(
      'base active',
    );
  });

  it('flattens nested arrays', () => {
    expect(cn('a', ['b', ['c', false, 'd']])).toBe('a b c d');
  });

  it('trims stray whitespace on each entry', () => {
    expect(cn('  a  ', 'b')).toBe('a b');
  });

  it('returns an empty string with no usable input', () => {
    expect(cn(false, null, undefined, '')).toBe('');
  });
});
