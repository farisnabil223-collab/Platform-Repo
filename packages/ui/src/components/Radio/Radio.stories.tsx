import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Design System/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Standard Option',
    name: 'demo-radio',
  },
};

export const Selected: Story = {
  args: {
    label: 'Selected Option',
    name: 'demo-radio',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Restricted Option (Locked)',
    name: 'demo-radio',
    disabled: true,
  },
};
