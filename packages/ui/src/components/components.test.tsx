import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge.js';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';
import { Spinner } from './spinner.js';
import { Textarea } from './textarea.js';

describe('Badge', () => {
  it('renders with the requested variant classes', () => {
    render(<Badge variant="success">Deployed</Badge>);

    const badge = screen.getByText('Deployed');
    expect(badge.className).toContain('bg-emerald-100');
  });

  it('defaults to the neutral variant', () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText('Draft').className).toContain('bg-slate-100');
  });
});

describe('Card', () => {
  it('composes header, content and footer sections', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Credits consumed this month</CardDescription>
        </CardHeader>
        <CardContent>1.240 credits</CardContent>
        <CardFooter>Updated now</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Usage' })).toBeInTheDocument();
    expect(screen.getByText('Credits consumed this month')).toBeInTheDocument();
    expect(screen.getByText('1.240 credits')).toBeInTheDocument();
    expect(screen.getByText('Updated now')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('exposes validation state via aria-invalid', () => {
    render(<Textarea aria-label="Prompt" invalid />);

    expect(screen.getByRole('textbox', { name: 'Prompt' })).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Spinner', () => {
  it('is announced as a status element with an accessible label', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});
