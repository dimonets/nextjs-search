'use client';

import React, { useEffect, use, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/providers/SearchProvider';
import { type Hit as _Hit } from '@/lib/search';
import Hit, { HitSkeleton } from '@/components/Hit';
import { cn } from '@/utils/cn';

type Props = {
  hitsPromise: Promise<{ hits: _Hit[], executionTime: number }>
};

export default function Hits({ hitsPromise }: Props) {
  const { hits, executionTime } = use(hitsPromise);

  const { view, setHitsLoadingTime } = useSearch();

  useEffect(() => {
    setHitsLoadingTime(executionTime);
  }, [executionTime, setHitsLoadingTime]);

  return (
    <div className="ais-Hits mt-4 group-has-[[data-pending]]:animate-pulse">
      <ol className={cn(
        'ais-Hits-list grid grid-cols-1 gap-4', 
        view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : ''
      )}>
        {hits.map((hit: _Hit) => (
          <li className="ais-Hits-item !radius-none !p-0 !shadow-none" key={hit.id}>
            <Hit hit={hit} view={view} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HitsSkeleton() {
  const { view } = useSearch();
  const items = new Array(10).fill(null).map((_, i) => i + 1);
  return (
    <div className="ais-Hits mt-4">
      <ol className={cn(
        'ais-Hits-list grid grid-cols-1 gap-4', 
        view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : ''
      )}>
        {items.map((item: number) => (
          <li className="ais-Hits-item !radius-none !p-0 !shadow-none" key={item}>
            <HitSkeleton view={view} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ViewButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { view, setView } = useSearch();

  function toggleView() {
    startTransition(() => {
      const currentValue = view;
      setView(currentValue === 'grid' ? 'list' : 'grid');
      document.cookie = `hits-view=${currentValue === 'grid' ? 'list' : 'grid'}`;
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        className="flex h-10 flex-none cursor-pointer items-center space-x-2 rounded border border-gray-300 px-4 md:ml-auto"
        onClick={() => toggleView()}
      >
        <span>View:</span>
        {(view === 'grid')
          ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.05882 0V5.71429H24V0M7.05882 20H24V14.2857H7.05882M7.05882 12.8571H24V7.14286H7.05882M0 5.71429H5.64706V0H0M0 20H5.64706V14.2857H0M0 12.8571H5.64706V7.14286H0V12.8571Z" fill="black" /></svg>
          : (view === 'list')
            ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2V6H12V2H8ZM14 2V6H18V2H14ZM14 8V12H18V8H14ZM14 14V18H18V14H14ZM12 18V14H8V18H12ZM6 18V14H2V18H6ZM6 12V8H2V12H6ZM6 6V2H2V6H6ZM8 12H12V8H8V12ZM2 0H18C18.5304 0 19.0391 0.210714 19.4142 0.585786C19.7893 0.960859 20 1.46957 20 2V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H2C0.92 20 0 19.1 0 18V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0Z" fill="black" /></svg>
            : null
        }
      </button>
    </>
  );
}