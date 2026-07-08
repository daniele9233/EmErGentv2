/**
 * Throws when the condition is falsy, narrowing the type on the happy path.
 * Use for programmer-error checks, not for user-input validation.
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}

/**
 * Exhaustiveness guard for discriminated unions: unreachable when the union
 * is fully handled, and a compile error appears as soon as a variant is added.
 */
export function assertNever(value: never, message = 'Unexpected value'): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}
