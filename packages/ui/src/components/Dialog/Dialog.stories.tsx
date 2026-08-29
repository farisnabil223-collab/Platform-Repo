import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Design System/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Action Dialog</Button>
        <Dialog
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Confirm User Deletion"
          description="Are you sure you want to permanently delete this student record?"
          footerActions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm Delete
              </Button>
            </>
          }
        >
          Deleting this user will automatically purge their active assignments submissions, grades logs, and profile records from the database. This action is irreversible.
        </Dialog>
      </div>
    );
  },
};
