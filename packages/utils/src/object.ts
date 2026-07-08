/** Returns a new object containing only the requested keys. */
export function pick<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> {
  const output = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in source) {
      output[key] = source[key];
    }
  }
  return output;
}

/** Returns a new object without the excluded keys. */
export function omit<T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Omit<T, K> {
  const excluded = new Set<PropertyKey>(keys);
  const output: Record<PropertyKey, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!excluded.has(key)) {
      output[key] = value;
    }
  }
  return output as Omit<T, K>;
}

/** True only for plain objects (object literals or null-prototype objects). */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
