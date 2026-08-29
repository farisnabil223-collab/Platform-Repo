import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination component', () => {
  it('triggers page change on click', () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />);
    fireEvent.click(screen.getByRole('button', { name: /go to page 3/i }));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});
