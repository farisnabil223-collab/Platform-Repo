import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion component', () => {
  it('toggles expansion state when trigger is clicked', () => {
    const items = [
      { id: 'i1', title: 'Item 1', content: <div>Content 1</div> },
    ];
    render(<Accordion items={items} />);
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Item 1' }));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });
});
