import { invariant } from './assert.js';

function abortReason(signal: AbortSignal): Error {
  return signal.reason instanceof Error ? signal.reason : new Error('Operation aborted');
}

/** Abortable delay. Rejects with the abort reason when the signal fires. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  invariant(ms >= 0, 'sleep duration must be >= 0');

  return new Promise((resolve, reject) => {
    if (signal === undefined) {
      setTimeout(resolve, ms);
      return;
    }

    if (signal.aborted) {
      reject(abortReason(signal));
      return;
    }

    const onAbort = (): void => {
      clearTimeout(timer);
      reject(abortReason(signal));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, message?: string) {
    super(message ?? `Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

/** Rejects with TimeoutError if the promise does not settle within `ms`. */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message?: string,
): Promise<T> {
  invariant(ms > 0, 'timeout must be > 0');

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new TimeoutError(ms, message));
        }, ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export interface RetryOptions {
  /** Total attempts, including the first one. Default: 3. */
  readonly maxAttempts?: number;
  /** Delay before the first retry. Default: 100ms. */
  readonly minDelayMs?: number;
  /** Upper bound for the backoff delay. Default: 5000ms. */
  readonly maxDelayMs?: number;
  /** Exponential growth factor. Default: 2. */
  readonly factor?: number;
  /** Randomizes each delay in [delay/2, delay] to avoid thundering herds. Default: true. */
  readonly jitter?: boolean;
  /** Aborts waiting between attempts. */
  readonly signal?: AbortSignal;
  /** Return false to stop retrying and rethrow immediately. Default: always retry. */
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Observer invoked before each backoff wait. */
  readonly onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

/**
 * Runs `operation` with exponential backoff. The attempt number (1-based) is
 * passed to the operation, `shouldRetry` and `onRetry`.
 */
export async function retry<T>(
  operation: (attempt: number) => Promise<T> | T,
  options: RetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const minDelayMs = options.minDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const factor = options.factor ?? 2;
  const jitter = options.jitter ?? true;
  const shouldRetry = options.shouldRetry ?? ((): boolean => true);

  invariant(maxAttempts >= 1, 'maxAttempts must be >= 1');
  invariant(minDelayMs >= 0, 'minDelayMs must be >= 0');
  invariant(maxDelayMs >= minDelayMs, 'maxDelayMs must be >= minDelayMs');
  invariant(factor >= 1, 'factor must be >= 1');

  let attempt = 0;
  for (;;) {
    attempt += 1;
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }

      const backoff = Math.min(maxDelayMs, minDelayMs * factor ** (attempt - 1));
      const delayMs = jitter ? Math.round(backoff / 2 + Math.random() * (backoff / 2)) : backoff;

      options.onRetry?.(error, attempt, delayMs);
      await sleep(delayMs, options.signal);
    }
  }
}
