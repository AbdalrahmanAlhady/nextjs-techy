// File: components/Pagination.tsx
'use client';

import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: Props) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationContainer>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`${baseUrl}?page=${currentPage - 1}`} />
          </PaginationItem>
        )}
        {pageNumbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink href={`${baseUrl}?page=${number}`} isActive={currentPage === number}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={`${baseUrl}?page=${currentPage + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationContainer>
  );
}
