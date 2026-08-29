import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProfileMenu } from './ProfileMenu';

const meta: Meta<typeof ProfileMenu> = {
  title: 'Design System/ProfileMenu',
  component: ProfileMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileMenu>;

export const Default: Story = {
  args: {
    name: 'Sophia Loren',
    email: 'sophia@eduverse.com',
    role: 'Teacher',
    onSignOut: () => alert('Signing out...'),
  },
};
