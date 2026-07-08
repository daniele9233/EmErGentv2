import { invariant } from './assert.js';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/** Formats a byte count using binary units (1 KB = 1024 B). */
export function formatBytes(bytes: number, decimals = 1): string {
  invariant(bytes >= 0, 'bytes must be >= 0');
  invariant(decimals >= 0, 'decimals must be >= 0');

  if (bytes === 0) {
    return '0 B';
  }

  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
  const unit = BYTE_UNITS[exponent] ?? 'B';
  const value = bytes / 1024 ** exponent;

  return `${Number.parseFloat(value.toFixed(decimals))} ${unit}`;
}

/** Formats a millisecond duration into a compact human-readable string. */
export function formatDurationMs(ms: number): string {
  invariant(ms >= 0, 'ms must be >= 0');

  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }

  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) {
    return `${Number.parseFloat(totalSeconds.toFixed(1))}s`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    const seconds = Math.round(totalSeconds - totalMinutes * 60);
    return seconds === 0 ? `${totalMinutes}m` : `${totalMinutes}m ${seconds}s`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes - hours * 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}
