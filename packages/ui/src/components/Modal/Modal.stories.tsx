import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold font-heading">Custom Modal Layout</h3>
            <p className="text-sm text-foreground/80">
              This is a completely custom-styled layout rendered inside a portal overlay.
            </p>
            <div className="bg-muted p-4 rounded border border-border/40 text-xs">
              Configure parameters inside the modal content directly.
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Dismiss
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
