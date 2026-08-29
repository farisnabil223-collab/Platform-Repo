import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Design System/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

const Buggy = () => {
  throw new Error('Database connection timed out after 30 seconds.');
};

export const CrashFallback: Story = {
  render: () => (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  ),
};
