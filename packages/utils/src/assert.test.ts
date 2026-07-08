import { describe, expect, it } from 'vitest';

import { assertNever, invariant } from './assert.js';

describe('invariant', () => {
  it('does nothing when the condition is truthy', () => {
    expect(() => {
      invariant(true, 'never thrown');
    }).not.toThrow();
  });

  it('throws with the provided message when the condition is falsy', () => {
    expect(() => {
      invariant(false, 'broken assumption');
    }).toThrow('Invariant violation: broken assumption');
  });

  it('narrows nullable values', () => {
    const value = ((): string | null => 'hello')();
    invariant(value !== null, 'value must be present');
    expect(value.toUpperCase()).toBe('HELLO');
  });
});

describe('assertNever', () => {
  it('always throws, embedding the unexpected value', () => {
    expect(() => assertNever('unexpected' as never)).toThrow('Unexpected value: "unexpected"');
  });

  it('supports a custom message', () => {
    expect(() => assertNever(42 as never, 'Unhandled variant')).toThrow('Unhandled variant: 42');
  });
});
