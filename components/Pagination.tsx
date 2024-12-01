'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { use } from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

type PaginationClassNames = {
  root: string,
  list: string,
  item: string,
  link: string
};

type Props = {
  statsPromise: Promise<{ 
    count: number,
    executionTime: number 
  }>,
  pageSize: number,
  currentPage: number,
  classNames?: Partial<PaginationClassNames>
};

export default function Pagination({ statsPromise, pageSize = 10, currentPage = 1, classNames = {} }: Props) {
  const { count } = use(statsPromise);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(count / pageSize);

  const pageNumbers: number[] = [-3, -2, -1, 0, 1, 2, 3]
    .map((v: number) => currentPage + v + (
      currentPage < 4 
        ? 4 - currentPage 
        : (
          currentPage > totalPages - 4
          ? (totalPages - currentPage) - 3
          : 0
        )
      )
    )
    .filter((page: number) => page > 0 && page <= totalPages);

  function createPageUrl(page: number): string {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', page.toString());
    return `${pathname}?${newSearchParams.toString()}`;
  }

  return (totalPages > 0 &&
    <div className={cn('ais-Pagination', classNames.root)}>
      <ul className={cn('ais-Pagination-list', classNames.list)}>
        <li key="first" className={
          cn('ais-Pagination-item', 
            currentPage === 1 ? 'ais-Pagination-item--disabled' : '',
            'ais-Pagination-item--firstPage',
            classNames.item
          )
        }>
          {currentPage === 1 
            ? <span className={cn('ais-Pagination-link', classNames.link)} aria-label="First Page">‹‹</span>
            : <Link href={createPageUrl(1)} className={cn('ais-Pagination-link', classNames.link)} aria-label="First Page">‹‹</Link>
          }
        </li>
        <li key="previous" className={
          cn('ais-Pagination-item', 
            currentPage === 1 ? 'ais-Pagination-item--disabled' : '',
            'ais-Pagination-item--previousPage',
            classNames.item
          )
        }>
          {currentPage === 1 
            ? <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Previous Page">‹</span>
            : <Link href={createPageUrl(currentPage - 1)} className={cn('ais-Pagination-link', classNames.link)} aria-label="Previous Page">‹</Link>
          }
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className={
            cn('ais-Pagination-item ais-Pagination-item--page', 
              currentPage === number ? 'ais-Pagination-item--selected' : '',
              classNames.item
            )
          }>
            <Link href={createPageUrl(number)} className={cn('ais-Pagination-link', classNames.link)} aria-label={`Page ${number}`}>{number}</Link>
          </li>
        ))}
        <li key="next" className={
          cn('ais-Pagination-item', 
            currentPage === totalPages ? 'ais-Pagination-item--disabled' : '',
            'ais-Pagination-item--nextPage',
            classNames.item
          )
        }>
          {currentPage === totalPages 
            ? <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Next Page">›</span>
            : <Link href={createPageUrl(currentPage + 1)} className={cn('ais-Pagination-link', classNames.link)} aria-label="Next Page">›</Link>
          }
        </li>
        <li key="last" className={
          cn('ais-Pagination-item', 
            currentPage === totalPages ? 'ais-Pagination-item--disabled' : '',
            'ais-Pagination-item--lastPage',
            classNames.item
          )
        }>
          {currentPage === totalPages 
            ? <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Last Page">››</span>
            : <Link href={createPageUrl(totalPages)} className={cn('ais-Pagination-link', classNames.link)} aria-label="Last Page">››</Link>
          }
        </li>
      </ul>
    </div>
  );
}

export function PaginationSkeleton({ classNames = {} }: { classNames?: Partial<PaginationClassNames> }) {
  const pageNumbers = Array.from(
    { length: 7 },
    (_, index) => index + 1
  );
  return (
    <div className={cn('ais-Pagination', classNames.root)}>
      <ul className={cn('ais-Pagination-list', classNames.list)}>
        <li key="first" className={cn('ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--firstPage', classNames.item)}>
          <span className={cn('ais-Pagination-link', classNames.link)} aria-label="First Page"></span>
        </li>
        <li key="previous" className={cn('ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--previousPage', classNames.item)}>
          <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Previous Page"></span>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className={cn('ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--page', classNames.item)}>
            <span className={cn('ais-Pagination-link', classNames.link)} aria-label={`Page ${number}`}></span>
          </li>
        ))}
        <li key="next" className={cn('ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--nextPage', classNames.item)}>
          <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Next Page"></span>
        </li>
        <li key="last" className={cn('ais-Pagination-item ais-Pagination-item--disabled ais-Pagination-item--lastPage', classNames.item)}>
          <span className={cn('ais-Pagination-link', classNames.link)} aria-label="Last Page"></span>
        </li>
      </ul>
    </div>
  );
}
