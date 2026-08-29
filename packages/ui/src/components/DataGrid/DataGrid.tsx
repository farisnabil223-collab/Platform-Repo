import * as React from 'react';
import { cn } from '../../index';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../Table/Table';

export interface DataGridColumn<T> {
  key: keyof T;
  header: string;
}

export interface DataGridProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataGridColumn<T>[];
  data: T[];
  label?: string;
}

export const DataGrid = <T extends Record<string, any>>({
  className,
  columns,
  data,
  label,
  ...props
}: DataGridProps<T>) => {
  return (
    <div className={cn('flex flex-col gap-2 w-full select-none', className)} {...props}>
      {label && <h4 className="text-sm font-semibold font-heading">{label}</h4>}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-xs text-muted-foreground py-6">
                No items recorded.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>{row[col.key]}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <p className="text-[10px] text-muted-foreground italic">[DataGrid scaffolded component]</p>
    </div>
  );
};
export default DataGrid;
