export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Explicit success/failure union for operations whose failure is an expected
 * outcome (as opposed to a programmer error, which should throw).
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.ok;
}

/** Normalizes an unknown thrown value into a proper Error instance. */
export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === 'string') {
    return new Error(value);
  }
  return new Error(`Non-error value thrown: ${JSON.stringify(value)}`);
}

/** Extracts the value or throws the (normalized) error. */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw toError(result.error);
}

/** Converts a promise into a Result instead of letting it reject. */
export async function fromPromise<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return ok(await promise);
  } catch (error) {
    return err(toError(error));
  }
}
