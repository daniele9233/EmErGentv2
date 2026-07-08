declare const brandSymbol: unique symbol;

/**
 * Nominal typing helper: `Brand<string, 'UserId'>` is assignable to `string`
 * but a plain `string` is not assignable to it, preventing id mix-ups across
 * entity boundaries at compile time with zero runtime cost.
 */
export type Brand<TBase, TTag extends string> = TBase & {
  readonly [brandSymbol]: TTag;
};
