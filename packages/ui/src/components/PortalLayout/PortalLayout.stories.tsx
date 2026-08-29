import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PortalLayout } from './PortalLayout';
import { ThemeProvider } from '../ThemeSwitcher/ThemeSwitcher';
import { LanguageProvider } from '../LanguageSwitcher/LanguageSwitcher';

const meta: Meta<typeof PortalLayout> = {
  title: 'Design System/PortalLayout',
  component: PortalLayout,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-[500px] border rounded-lg overflow-hidden">
            <Story />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PortalLayout>;

// Mock navigation path
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: () => {},
  }),
}));

export const AdminShell: Story = {
  args: {
    role: 'ADMIN',
    navigationItems: [
      { id: '1', label: 'Overview', href: '/dashboard' },
      { id: '2', label: 'User Admin', href: '/users' },
      { id: '3', label: 'Observability Settings', href: '/settings' },
    ],
    user: {
      name: 'System Admin',
      email: 'admin@eduverse.com',
      permissions: ['all'],
    },
    pageTitle: 'Database Dashboard',
    pageDescription: 'Monitor active user database connections and NestJS API health states.',
    children: (
      <div className="bg-card border border-border/50 rounded-lg p-6 flex flex-col gap-2">
        <h4 className="font-semibold text-sm font-heading">Core Engine Health</h4>
        <p className="text-xs text-muted-foreground">All databases connected. API metrics normal.</p>
      </div>
    ),
  },
};
