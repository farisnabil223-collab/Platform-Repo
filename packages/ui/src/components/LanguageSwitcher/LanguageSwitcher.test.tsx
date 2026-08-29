import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageSwitcher, LanguageProvider } from './LanguageSwitcher';

describe('LanguageSwitcher component', () => {
  it('renders language switcher options', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /العربية/i })).toBeInTheDocument();
  });
});
