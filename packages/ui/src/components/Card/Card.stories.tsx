import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>System Performance</CardTitle>
        <CardDescription>Server status for virtual classrooms.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80">
          All instances are performing optimally. Average latency is 42ms.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm">
          Dismiss
        </Button>
        <Button variant="primary" size="sm">
          View Metrics
        </Button>
      </CardFooter>
    </Card>
  ),
};
