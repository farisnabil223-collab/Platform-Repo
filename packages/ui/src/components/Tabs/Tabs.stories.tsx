import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Design System/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    tabs: [
      { id: 'general', label: 'General Info', content: <div className="p-4 bg-muted/40 rounded border border-border/40">General content modules</div> },
      { id: 'settings', label: 'Preferences', content: <div className="p-4 bg-muted/40 rounded border border-border/40">Settings configuration</div> },
      { id: 'security', label: 'Security Keys', content: <div className="p-4 bg-muted/40 rounded border border-border/40">Credential and token details</div> },
    ],
  },
};
