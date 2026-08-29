import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from './Radio';

describe('Radio component', () => {
  it('renders radio button with label', () => {
    render(<Radio label="Option A" name="test-group" />);
    expect(screen.getByLabelText(/option a/i)).toBeInTheDocument();
  });

  it('triggers change state when clicked', () => {
    const handleChange = jest.fn();
    render(<Radio label="Option B" name="test-group" onChange={handleChange} />);
    const radio = screen.getByLabelText(/option b/i);
    fireEvent.click(radio);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(radio).toBeChecked();
  });
});
