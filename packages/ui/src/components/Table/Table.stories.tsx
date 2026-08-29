import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Design System/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Alex Johnson</TableCell>
          <TableCell>Advanced Mathematics</TableCell>
          <TableCell>94%</TableCell>
          <TableCell>Pass</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Sophia Loren</TableCell>
          <TableCell>Quantum Physics</TableCell>
          <TableCell>89%</TableCell>
          <TableCell>Pass</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Michael Jordan</TableCell>
          <TableCell>Sports Science</TableCell>
          <TableCell>52%</TableCell>
          <TableCell className="text-red-500 font-semibold">Review</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
