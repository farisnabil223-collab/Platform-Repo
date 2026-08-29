import React from 'react';
import { render, screen } from '@testing-library/react';
import { PortalLayout } from './PortalLayout';
import { ThemeProvider } from '../ThemeSwitcher/ThemeSwitcher';
import { LanguageProvider } from '../LanguageSwitcher/LanguageSwitcher';

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('PortalLayout component', () => {
  it('renders branding and child children elements', () => {
    const navItems = [
      { id: 'd1', label: 'My Dashboard', href: '/dashboard' },
    ];
    const user = {
      name: 'Dr. Emily',
      email: 'emily@edu.com',
      permissions: ['read:dashboard'],
    };

    render(
      <LanguageProvider>
        <ThemeProvider>
          <PortalLayout role="TEACHER" navigationItems={navItems} user={user} pageTitle="Physics Portal">
            <div>Portal Content</div>
          </PortalLayout>
        </ThemeProvider>
      </LanguageProvider>
    );

    expect(screen.getByText('Physics Portal')).toBeInTheDocument();
    expect(screen.getByText('Portal Content')).toBeInTheDocument();
    expect(screen.getByText('emily@edu.com')).toBeInTheDocument();
  });
});
