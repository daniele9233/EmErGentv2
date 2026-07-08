import { type SVGProps } from 'react';

import { cn } from '../lib/cn.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Spinner({ size = 'md', className, ...rest }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-current', sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}
