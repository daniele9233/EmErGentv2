import { describe, expect, it } from 'vitest';

import { retry, sleep, TimeoutError, withTimeout } from './async.js';

describe('sleep', () => {
  it('resolves after the given delay', async () => {
    const start = Date.now();
    await sleep(20);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('rejects with the abort reason when aborted while waiting', async () => {
    const controller = new AbortController();
    const pending = sleep(1000, controller.signal);

    controller.abort(new Error('stop waiting'));

    await expect(pending).rejects.toThrow('stop waiting');
  });

  it('rejects immediately when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort(new Error('already aborted'));

    await expect(sleep(10, controller.signal)).rejects.toThrow('already aborted');
  });

  it('rejects negative durations synchronously', () => {
    expect(() => sleep(-1)).toThrow('Invariant violation');
  });
});

describe('withTimeout', () => {
  it('resolves when the promise settles in time', async () => {
    await expect(withTimeout(Promise.resolve('fast'), 50)).resolves.toBe('fast');
  });

  it('rejects with TimeoutError when the promise is too slow', async () => {
    await expect(withTimeout(sleep(500), 10)).rejects.toBeInstanceOf(TimeoutError);
  });

  it('carries the timeout duration and custom message', async () => {
    const failure = withTimeout(sleep(500), 10, 'build took too long');

    await expect(failure).rejects.toThrow('build took too long');
    await failure.catch((error: unknown) => {
      expect(error).toBeInstanceOf(TimeoutError);
      expect((error as TimeoutError).timeoutMs).toBe(10);
    });
  });
});

describe('retry', () => {
  it('returns the first successful attempt without retrying', async () => {
    let calls = 0;

    const value = await retry(() => {
      calls += 1;
      return 'immediate';
    });

    expect(value).toBe('immediate');
    expect(calls).toBe(1);
  });

  it('retries until the operation succeeds', async () => {
    let calls = 0;

    const value = await retry(
      (attempt) => {
        calls += 1;
        if (attempt < 3) {
          throw new Error(`failure ${attempt}`);
        }
        return 'recovered';
      },
      { maxAttempts: 5, minDelayMs: 1, jitter: false },
    );

    expect(value).toBe('recovered');
    expect(calls).toBe(3);
  });

  it('throws the last error once attempts are exhausted', async () => {
    let calls = 0;

    await expect(
      retry(
        () => {
          calls += 1;
          throw new Error(`always failing (${calls})`);
        },
        { maxAttempts: 3, minDelayMs: 1, jitter: false },
      ),
    ).rejects.toThrow('always failing (3)');

    expect(calls).toBe(3);
  });

  it('stops immediately when shouldRetry returns false', async () => {
    let calls = 0;

    await expect(
      retry(
        () => {
          calls += 1;
          throw new Error('fatal');
        },
        { maxAttempts: 5, minDelayMs: 1, shouldRetry: () => false },
      ),
    ).rejects.toThrow('fatal');

    expect(calls).toBe(1);
  });

  it('reports exponential delays through onRetry when jitter is disabled', async () => {
    const delays: number[] = [];

    await expect(
      retry(
        () => {
          throw new Error('nope');
        },
        {
          maxAttempts: 4,
          minDelayMs: 10,
          factor: 2,
          jitter: false,
          onRetry: (_error, _attempt, delayMs) => {
            delays.push(delayMs);
          },
        },
      ),
    ).rejects.toThrow('nope');

    expect(delays).toEqual([10, 20, 40]);
  });

  it('caps delays at maxDelayMs', async () => {
    const delays: number[] = [];

    await expect(
      retry(
        () => {
          throw new Error('nope');
        },
        {
          maxAttempts: 4,
          minDelayMs: 10,
          maxDelayMs: 15,
          factor: 2,
          jitter: false,
          onRetry: (_error, _attempt, delayMs) => {
            delays.push(delayMs);
          },
        },
      ),
    ).rejects.toThrow('nope');

    expect(delays).toEqual([10, 15, 15]);
  });
});
