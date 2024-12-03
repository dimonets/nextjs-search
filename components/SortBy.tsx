'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { cn } from '@/utils/cn';

type SortByClassNames = {
  root: string,
  select: string,
  option: string
};

type Props = {
  classNames?: Partial<SortByClassNames>
};

export default function SortBy({
  classNames = {}
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort') || '';
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn('ais-SortBy', classNames.root)}>
      <select className={cn('ais-SortBy-select', classNames.select)} role="img" aria-label="Sort results by"
        onChange={e => {
          startTransition(() => {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            if (e.target.value && typeof e.target.value === 'string' && e.target.value.length > 0)
              newSearchParams.set('sort', e.target.value);
            else
              newSearchParams.delete('sort');
            newSearchParams.delete('page');
            router.push(`?${newSearchParams.toString()}`, {
              scroll: false,
            });
          });
        }}
        defaultValue={sortBy}>
        <option className={cn('ais-SortBy-option', classNames.option)} value="">Sort by Featured</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="price_asc">Price Ascending</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="price_desc">Price Descending</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="name_asc">Name Ascending</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="name_desc">Name Descending</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="sales_desc">Bestsellers</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="rating_desc">Most Rated</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="reviews_desc">Most Reviewed</option>
        <option className={cn('ais-SortBy-option', classNames.option)} value="popularity_desc">Most Popular</option>
      </select>
    </div>
  )
}

export function SortBySkeleton({
  classNames = {}
}: Props) {
  return (
    <div className={cn('ais-SortBy w-[200px] h-[40px] overflow-hidden flex-none relative', classNames.root)}>
        <div className={cn('ais-SortBy-text w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent', classNames.select)}></div>
    </div>
  );
}
