import { describe, expect, it } from 'vitest';

import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, normalizePagination, toPaginatedResult } from './api.js';

describe('normalizePagination', () => {
  it('returns defaults when the query is missing', () => {
    expect(normalizePagination()).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
    expect(normalizePagination({})).toEqual({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  });

  it('clamps page to a minimum of 1', () => {
    expect(normalizePagination({ page: 0 }).page).toBe(1);
    expect(normalizePagination({ page: -5 }).page).toBe(1);
  });

  it('clamps pageSize into [1, MAX_PAGE_SIZE]', () => {
    expect(normalizePagination({ pageSize: 0 }).pageSize).toBe(1);
    expect(normalizePagination({ pageSize: 10_000 }).pageSize).toBe(MAX_PAGE_SIZE);
  });

  it('truncates fractional values', () => {
    expect(normalizePagination({ page: 2.9, pageSize: 15.7 })).toEqual({ page: 2, pageSize: 15 });
  });

  it('falls back to defaults on non-finite input', () => {
    expect(normalizePagination({ page: Number.NaN, pageSize: Number.POSITIVE_INFINITY })).toEqual({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  });
});

describe('toPaginatedResult', () => {
  it('computes totalPages with a ceiling division', () => {
    const result = toPaginatedResult(['a', 'b'], 41, { page: 1, pageSize: 20 });

    expect(result.totalPages).toBe(3);
    expect(result.totalItems).toBe(41);
    expect(result.items).toEqual(['a', 'b']);
  });

  it('returns zero pages for an empty collection', () => {
    const result = toPaginatedResult([], 0, { page: 1, pageSize: 20 });

    expect(result.totalPages).toBe(0);
  });
});
