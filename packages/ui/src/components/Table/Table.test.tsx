import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './Table';

describe('Table component', () => {
  it('renders standard table data', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Data Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Data Cell')).toBeInTheDocument();
  });
});
