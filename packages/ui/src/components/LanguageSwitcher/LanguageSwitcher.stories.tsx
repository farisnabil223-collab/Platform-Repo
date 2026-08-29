import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitcher, LanguageProvider } from './LanguageSwitcher';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Design System/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <div className="p-8 bg-card border rounded-lg max-w-sm flex justify-center">
          <Story />
        </div>
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const Default: Story = {};
