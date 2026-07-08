import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input.js';

describe('Input', () => {
  it('renders as an accessible textbox', () => {
    render(<Input aria-label="Project name" placeholder="My app" />);

    expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument();
  });

  it('propagates typed values through onChange', () => {
    const onChange = vi.fn();
    render(<Input aria-label="Project name" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Project name' }), {
      target: { value: 'emergent' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveValue('emergent');
  });

  it('exposes validation state via aria-invalid and styling', () => {
    render(<Input aria-label="Email" invalid />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toContain('border-red-500');
  });

  it('omits aria-invalid when the field is valid', () => {
    render(<Input aria-label="Email" />);

    expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
  });
});
