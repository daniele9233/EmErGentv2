/**
 * Platform-wide error codes. Every API error response carries exactly one of
 * these codes; HTTP status mapping is owned by the backend error layer.
 */
export const ERROR_CODES = [
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_FAILED',
  'CONFLICT',
  'RATE_LIMITED',
  'INSUFFICIENT_CREDITS',
  'INTERNAL_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && (ERROR_CODES as readonly string[]).includes(value);
}

export interface ApiErrorPayload {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly requestId?: string;
}
