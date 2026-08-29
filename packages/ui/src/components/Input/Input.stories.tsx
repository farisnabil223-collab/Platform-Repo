import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
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
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'enter_your_username',
    helperText: 'Must be unique across the platform.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'student@eduverse.com',
    error: 'This email is already registered.',
    value: 'taken-email@eduverse.com',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Database Server Port',
    value: '5432',
    disabled: true,
    helperText: 'Database ports are configured by the admin shell.',
  },
};
