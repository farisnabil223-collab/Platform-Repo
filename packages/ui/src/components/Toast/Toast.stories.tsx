import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button/Button';

const meta: Meta = {
  title: 'Design System/Toast',
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="p-8 border border-dashed border-border rounded-lg max-w-sm flex items-center justify-center bg-card">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { toast } = useToast();
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Database Saved',
              description: 'Profile updates have been persistent on the catalog modules.',
              type: 'success',
            })
          }
        >
          Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Server Error',
              description: 'Failed to synchronize with NestJS API engine.',
              type: 'error',
            })
          }
        >
          Error Toast
        </Button>
      </div>
    );
  },
};
