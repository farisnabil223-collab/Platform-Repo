import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeSwitcher, ThemeProvider } from './ThemeSwitcher';

describe('ThemeSwitcher component', () => {
  it('renders theme switcher options', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system/i })).toBeInTheDocument();
  });
});
