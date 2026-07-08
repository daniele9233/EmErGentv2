export type ClassValue = string | number | null | undefined | false | readonly ClassValue[];

/**
 * Joins class names, skipping falsy values and flattening nested arrays.
 * Kept dependency-free on purpose: the design system owns its own primitives.
 */
export function cn(...inputs: readonly ClassValue[]): string {
  const classes: string[] = [];

  const visit = (input: ClassValue): void => {
    if (input === null || input === undefined || input === false) {
      return;
    }
    if (typeof input === 'string' || typeof input === 'number') {
      const trimmed = String(input).trim();
      if (trimmed.length > 0) {
        classes.push(trimmed);
      }
      return;
    }
    for (const item of input) {
      visit(item);
    }
  };

  for (const input of inputs) {
    visit(input);
  }

  return classes.join(' ');
}
