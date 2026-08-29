import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './Toast';

const TestComponent = () => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Success Toast', description: 'Action complete', type: 'success' })}>
      Trigger Toast
    </button>
  );
};

describe('Toast notification system', () => {
  it('triggers a toast alert when called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }));
    expect(await screen.findByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Action complete')).toBeInTheDocument();
  });
});
