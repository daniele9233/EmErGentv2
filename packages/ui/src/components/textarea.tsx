import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../lib/cn.js';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the field as failed validation, styling it and setting aria-invalid. */
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'min-h-20 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors',
        'placeholder:text-slate-400 focus:outline-none focus:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
        invalid
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600',
        className,
      )}
      {...rest}
    />
  );
});
