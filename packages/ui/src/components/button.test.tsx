import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button.js';

describe('Button', () => {
  it('renders its children and defaults to type="button"', () => {
    render(<Button>Save project</Button>);

    const button = screen.getByRole('button', { name: 'Save project' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('invokes onClick when pressed', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Run</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Run' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('bg-red-600');
    expect(button.className).toContain('h-12');
  });

  it('disables itself and shows a spinner while loading', () => {
    render(<Button isLoading>Deploying</Button>);

    const button = screen.getByRole('button', { name: /Deploying/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('stays disabled when explicitly disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Blocked
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Blocked' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
