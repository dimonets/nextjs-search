'use client';

import React, { use } from 'react';
import { type Hit as _Hit } from '@/lib/search';
import Hit, { HitSkeleton } from '@/components/Hit';
import { cn } from '@/utils/cn';

type Props = {
  hitsPromise: Promise<{ hits: _Hit[], executionTime: number }>
};

export default function Hits({ hitsPromise }: Props) {
  const { hits, executionTime } = use(hitsPromise);

  const view = 'grid';
  return (
    <div className="ais-Hits mt-4">
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
  const view = 'grid';
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
