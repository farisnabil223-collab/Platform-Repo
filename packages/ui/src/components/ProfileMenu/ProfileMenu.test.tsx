import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileMenu } from './ProfileMenu';

describe('ProfileMenu component', () => {
  it('opens and renders links on click', () => {
    render(<ProfileMenu name="Alex" email="alex@edu.com" role="STUDENT" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('alex@edu.com')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });
});
