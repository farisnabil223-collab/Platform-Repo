import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Loading, Spinner } from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'Design System/Loading',
  component: Loading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    label: 'Connecting to database...',
    fullScreen: false,
  },
};

export const Spinners: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};
