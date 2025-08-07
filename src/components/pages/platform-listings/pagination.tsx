
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const queryString = createQueryString('page', String(page));
    router.push(`${pathname}?${queryString}`, { scroll: true });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = <span className="px-4 py-2">...</span>;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </Button>
        );
      }
    } else {
      pageNumbers.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="icon"
          onClick={() => handlePageChange(1)}
          aria-label="Go to page 1"
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pageNumbers.push(ellipsis);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageChange(i)}
            aria-label={`Go to page ${i}`}
            aria-current={currentPage === i ? 'page' : undefined}
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(ellipsis);
      }

      pageNumbers.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="icon"
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </Button>
      );
    }
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <div className="hidden sm:flex items-center gap-2">
        {renderPageNumbers()}
      </div>
      <div className="sm:hidden">
        <span className="px-4 py-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
