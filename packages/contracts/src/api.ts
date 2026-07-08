import { type ApiErrorPayload } from './errors.js';

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: ApiErrorPayload;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export interface PaginationQuery {
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

/**
 * Clamps arbitrary (possibly user-supplied) pagination input into a safe
 * query: page >= 1, 1 <= pageSize <= MAX_PAGE_SIZE, integers only.
 */
export function normalizePagination(query?: {
  readonly page?: number;
  readonly pageSize?: number;
}): PaginationQuery {
  const rawPage = query?.page ?? 1;
  const rawPageSize = query?.pageSize ?? DEFAULT_PAGE_SIZE;

  const page = Number.isFinite(rawPage) ? Math.max(1, Math.trunc(rawPage)) : 1;
  const pageSize = Number.isFinite(rawPageSize)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(rawPageSize)))
    : DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

export function toPaginatedResult<T>(
  items: readonly T[],
  totalItems: number,
  query: PaginationQuery,
): PaginatedResult<T> {
  return {
    items,
    page: query.page,
    pageSize: query.pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize),
  };
}
