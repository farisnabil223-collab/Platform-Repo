import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress component', () => {
  it('renders progress bar with correct aria values', () => {
    render(<Progress value={45} data-testid="progressbar" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '45');
  });
});
