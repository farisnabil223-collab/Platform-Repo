import React from 'react';
import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea component', () => {
  it('renders textarea with label', () => {
    render(<Textarea label="Description" placeholder="Enter details" />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Textarea label="Bio" helperText="Brief intro for your profile" />);
    expect(screen.getByText('Brief intro for your profile')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Textarea label="Comment" error="Comment cannot be empty" />);
    expect(screen.getByText('Comment cannot be empty')).toBeInTheDocument();
  });
});
