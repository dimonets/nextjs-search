'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { cn } from '@/utils/cn';

type HitsPerPageClassNames = {
  root: string,
  select: string,
  option: string
};

type Props = {
  classNames?: Partial<HitsPerPageClassNames>
};

export default function HitsPerPage({
  classNames = {}
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('size') || 10;
  const [isPending, startTransition] = useTransition();
  return (
    <div className={cn('ais-HitsPerPage', classNames.root)}>
      <select className={cn('ais-HitsPerPage-select', classNames.select)} role="combobox" aria-expanded="false" aria-label="Refine page size"
        onChange={e => {
          startTransition(() => {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.set('size', e.target.value);
            newSearchParams.delete('page');
            router.push(`?${newSearchParams.toString()}`, {
              scroll: false,
            });
          });
        }}
        defaultValue={sortBy}>
        <option className={cn('ais-HitsPerPage-option', classNames.option)} value="5">5 hits per page</option>
        <option className={cn('ais-HitsPerPage-option', classNames.option)} value="10">10 hits per page</option>
        <option className={cn('ais-HitsPerPage-option', classNames.option)} value="20">20 hits per page</option>
        <option className={cn('ais-HitsPerPage-option', classNames.option)} value="40">40 hits per page</option>
      </select>
    </div>
  )
}

export function HitsPerPageSkeleton({
  classNames = {}
}: Props) {
  return (
    <div className={cn('ais-HitsPerPage w-[200px] h-[40px] overflow-hidden flex-none relative', classNames.root)}>
        <div className={cn('ais-HitsPerPage-text w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent', classNames.select)}></div>
    </div>
  );
}