import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

describe('Select component', () => {
  it('renders select with options and label', () => {
    render(
      <Select label="Choose role">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </Select>
    );
    expect(screen.getByLabelText(/choose role/i)).toBeInTheDocument();
  });

  it('triggers change event when selecting option', () => {
    const handleChange = jest.fn();
    render(
      <Select label="Choose role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </Select>
    );
    const select = screen.getByLabelText(/choose role/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'teacher' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select.value).toBe('teacher');
  });
});
