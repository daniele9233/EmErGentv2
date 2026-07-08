import { describe, expect, it } from 'vitest';

import { err, fromPromise, isErr, isOk, ok, toError, unwrap } from './result.js';

describe('ok / err / guards', () => {
  it('builds and discriminates success results', () => {
    const result = ok(42);

    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
    expect(result.value).toBe(42);
  });

  it('builds and discriminates failure results', () => {
    const failure = err(new Error('boom'));

    expect(isOk(failure)).toBe(false);
    expect(isErr(failure)).toBe(true);
    expect(failure.error.message).toBe('boom');
  });
});

describe('toError', () => {
  it('passes Error instances through', () => {
    const original = new TypeError('typed');
    expect(toError(original)).toBe(original);
  });

  it('wraps strings', () => {
    expect(toError('plain message').message).toBe('plain message');
  });

  it('wraps arbitrary values with a JSON representation', () => {
    expect(toError({ code: 1 }).message).toBe('Non-error value thrown: {"code":1}');
  });
});

describe('unwrap', () => {
  it('returns the value of a success', () => {
    expect(unwrap(ok('payload'))).toBe('payload');
  });

  it('throws the error of a failure', () => {
    expect(() => unwrap(err(new Error('nope')))).toThrow('nope');
  });

  it('normalizes non-Error failures before throwing', () => {
    expect(() => unwrap(err('raw failure'))).toThrow('raw failure');
  });
});

describe('fromPromise', () => {
  it('captures resolutions', async () => {
    const result = await fromPromise(Promise.resolve(7));

    expect(result).toEqual(ok(7));
  });

  it('captures rejections as normalized errors', async () => {
    const result = await fromPromise(Promise.reject(new Error('rejected')));

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.message).toBe('rejected');
    }
  });
});
