import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Design System/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const LoadingProfile: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border border-border rounded-lg max-w-sm">
      <Skeleton variant="circle" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-4/5 h-3" />
      </div>
    </div>
  ),
};
