import { describe, expect, it } from 'vitest';

import { ERROR_CODES, isErrorCode } from './errors.js';

describe('isErrorCode', () => {
  it('accepts every declared error code', () => {
    for (const code of ERROR_CODES) {
      expect(isErrorCode(code)).toBe(true);
    }
  });

  it('rejects unknown strings', () => {
    expect(isErrorCode('SOMETHING_ELSE')).toBe(false);
    expect(isErrorCode('not_found')).toBe(false);
    expect(isErrorCode('')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(isErrorCode(undefined)).toBe(false);
    expect(isErrorCode(null)).toBe(false);
    expect(isErrorCode(42)).toBe(false);
    expect(isErrorCode({ code: 'NOT_FOUND' })).toBe(false);
  });
});
