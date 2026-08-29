import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Design System/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      { id: 'q1', title: 'How does the billing module work?', content: 'Billing is processed automatically on the first day of every academic month.' },
      { id: 'q2', title: 'Can I request a password change?', content: 'Yes, password recovery requests can be initiated from the login panel of any portal.' },
      { id: 'q3', title: 'What is the system uptime policy?', content: 'EduVerse guarantees a 99.9% uptime SLA for all core modules and administrative consoles.' },
    ],
  },
};
