import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge component', () => {
  it('renders badge with correct text content', () => {
    render(<Badge>Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders correct classes for primary variant', () => {
    render(<Badge variant="primary">New</Badge>);
    expect(screen.getByText('New').className).toContain('bg-primary');
  });
});
