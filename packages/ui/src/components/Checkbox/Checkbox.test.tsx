import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox component', () => {
  it('renders checkbox with label', () => {
    render(<Checkbox label="Agree to terms" />);
    expect(screen.getByLabelText(/agree to terms/i)).toBeInTheDocument();
  });

  it('triggers onChange event when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Subscribe" onChange={handleChange} />);
    const checkbox = screen.getByLabelText(/subscribe/i);
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it('is disabled when disabled prop is provided', () => {
    render(<Checkbox label="Locked opt" disabled />);
    expect(screen.getByLabelText(/locked opt/i)).toBeDisabled();
  });
});
