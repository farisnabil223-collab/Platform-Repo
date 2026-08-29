import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSwitcher, ThemeProvider } from './ThemeSwitcher';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Design System/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-8 bg-card border rounded-lg max-w-sm flex justify-center">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {};
