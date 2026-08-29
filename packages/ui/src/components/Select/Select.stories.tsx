import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Academic Year',
    helperText: 'Select the current academic registration period.',
    children: (
      <>
        <option value="2025-2026">Year 2025-2026</option>
        <option value="2026-2027">Year 2026-2027 (Current)</option>
        <option value="2027-2028">Year 2027-2028</option>
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    label: 'Preferred Language',
    error: 'Please choose an supported system language.',
    children: (
      <>
        <option value="">Select a language...</option>
        <option value="en">English</option>
        <option value="ar">Arabic</option>
      </>
    ),
  },
};
