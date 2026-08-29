import * as React from 'react';
import { cn } from '../../index';
import { Button } from '../Button/Button';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-between px-4 py-3 border-t border-border/40 select-none bg-card/30 rounded-b-lg', className)}
      {...props}
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between w-full">
        <div>
          <p className="text-xs text-muted-foreground">
            Showing Page <span className="font-semibold text-foreground">{currentPage}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>
        </div>
        <div>
          <div className="inline-flex gap-1" aria-label="Pagination pages">
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
            >
              &lt;
            </Button>
            {getPageNumbers().map((p) => (
              <Button
                key={p}
                variant={currentPage === p ? 'primary' : 'outline'}
                size="sm"
                className="w-9 h-9 p-0"
                onClick={() => onPageChange(p)}
                aria-current={currentPage === p ? 'page' : undefined}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Pagination;
