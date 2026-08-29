import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'Design System/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Info: Story = {
  args: {
    type: 'info',
    title: 'System Maintenance Scheduled',
    description: 'The platform will undergo standard patches next Saturday at 02:00 GMT.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Assignment Submitted',
    description: 'Your mathematical portfolio homework has been uploaded successfully.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Low Storage Quota Warning',
    description: 'Your workspace attachments storage is currently at 92% capacity.',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Authentication Denied',
    description: 'You do not have administrative privileges to modify database settings.',
  },
};
