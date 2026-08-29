import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading component', () => {
  it('renders progress text and loading animation', () => {
    render(<Loading label="Loading records..." />);
    expect(screen.getByText('Loading records...')).toBeInTheDocument();
  });
});
