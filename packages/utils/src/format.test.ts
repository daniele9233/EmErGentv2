import { describe, expect, it } from 'vitest';

import { formatBytes, formatDurationMs } from './format.js';

describe('formatBytes', () => {
  it('formats zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats plain bytes', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('formats binary multiples', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 ** 2)).toBe('1 MB');
    expect(formatBytes(5 * 1024 ** 3)).toBe('5 GB');
  });

  it('honours the decimals parameter', () => {
    expect(formatBytes(1555, 2)).toBe('1.52 KB');
    expect(formatBytes(1555, 0)).toBe('2 KB');
  });

  it('rejects negative input', () => {
    expect(() => formatBytes(-1)).toThrow('Invariant violation');
  });
});

describe('formatDurationMs', () => {
  it('formats sub-second durations in milliseconds', () => {
    expect(formatDurationMs(0)).toBe('0ms');
    expect(formatDurationMs(999)).toBe('999ms');
  });

  it('formats seconds with one decimal at most', () => {
    expect(formatDurationMs(1000)).toBe('1s');
    expect(formatDurationMs(1500)).toBe('1.5s');
    expect(formatDurationMs(59_400)).toBe('59.4s');
  });

  it('formats minutes with remaining seconds', () => {
    expect(formatDurationMs(60_000)).toBe('1m');
    expect(formatDurationMs(125_000)).toBe('2m 5s');
  });

  it('formats hours with remaining minutes', () => {
    expect(formatDurationMs(3_600_000)).toBe('1h');
    expect(formatDurationMs(3_720_000)).toBe('1h 2m');
  });

  it('rejects negative input', () => {
    expect(() => formatDurationMs(-5)).toThrow('Invariant violation');
  });
});
