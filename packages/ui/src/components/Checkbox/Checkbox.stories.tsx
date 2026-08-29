import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'I agree to the terms and conditions.',
  },
};

export const Checked: Story = {
  args: {
    label: 'Enable weekly analytical reports.',
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Agree to the EduVerse terms of service.',
    error: 'You must agree to proceed.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Restrict access (Admin configured).',
    disabled: true,
    checked: true,
  },
};
