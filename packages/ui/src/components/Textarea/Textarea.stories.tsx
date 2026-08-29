import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Course Syllabus Summary',
    placeholder: 'Outline the course syllabus modules here...',
    helperText: 'A summary is displayed in the student syllabus search dashboard.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Assignment Feedback',
    placeholder: 'Write constructive feedback...',
    error: 'Feedback exceeds the maximum 1000 character limit.',
    value: 'A'.repeat(1005),
  },
};
