import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from './Dialog';

describe('Dialog component', () => {
  it('does not render when isOpen is false', () => {
    render(<Dialog isOpen={false} onClose={() => {}} title="Test Dialog">Content</Dialog>);
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('renders content and headers when isOpen is true', () => {
    render(<Dialog isOpen={true} onClose={() => {}} title="Test Dialog">Content Details</Dialog>);
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Content Details')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Dialog isOpen={true} onClose={handleClose} title="Test">Content</Dialog>);
    fireEvent.click(screen.getByLabelText(/close dialog/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
