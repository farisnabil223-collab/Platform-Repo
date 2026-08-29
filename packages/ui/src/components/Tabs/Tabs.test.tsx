import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

describe('Tabs component', () => {
  it('renders tab headers and content panels', () => {
    const tabs = [
      { id: 't1', label: 'Tab 1', content: <div>Panel 1</div> },
      { id: 't2', label: 'Tab 2', content: <div>Panel 2</div> },
    ];
    render(<Tabs tabs={tabs} />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
    expect(screen.queryByText('Panel 1')).not.toBeInTheDocument();
  });
});
