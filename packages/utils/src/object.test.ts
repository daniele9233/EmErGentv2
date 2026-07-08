import { describe, expect, it } from 'vitest';

import { isPlainObject, omit, pick } from './object.js';

describe('pick', () => {
  it('keeps only the requested keys', () => {
    const source = { a: 1, b: 2, c: 3 };

    expect(pick(source, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('does not mutate the source', () => {
    const source = { a: 1, b: 2 };
    pick(source, ['a']);

    expect(source).toEqual({ a: 1, b: 2 });
  });
});

describe('omit', () => {
  it('drops the excluded keys', () => {
    const source = { a: 1, b: 2, c: 3 };

    expect(omit(source, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('returns an equal object when no keys are excluded', () => {
    const source = { a: 1 };

    expect(omit(source, [])).toEqual(source);
  });
});

describe('isPlainObject', () => {
  it('accepts object literals and null-prototype objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ nested: true })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('rejects arrays, class instances and primitives', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
    expect(isPlainObject(3)).toBe(false);
  });
});
