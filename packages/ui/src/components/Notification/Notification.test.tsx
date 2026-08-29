import React from 'react';
import { render, screen } from '@testing-library/react';
import { Notification } from './Notification';

describe('Notification component', () => {
  it('renders correctly with title and description', () => {
    render(<Notification title="Update Complete" description="Workspace successfully synced." />);
    expect(screen.getByText('Update Complete')).toBeInTheDocument();
    expect(screen.getByText('Workspace successfully synced.')).toBeInTheDocument();
  });
});
