'use client';

import React, { useEffect, use } from 'react';
import { useSearch } from '@/providers/SearchProvider';
import { type Stat } from '@/lib/search';
import { cn } from '@/utils/cn';

type StatsClassNames = {
  root: string,
  text: string
};

type Props = {
  statsPromise: Promise<Stat & { executionTime: number }>,
  classNames?: Partial<StatsClassNames>
};

export default function Stats({ statsPromise, classNames = {} }: Props) {
  const { count, executionTime } = use(statsPromise);
  const { setStatsLoadingTime  } = useSearch();

  useEffect(() => {
    setStatsLoadingTime(executionTime);
  }, [executionTime, setStatsLoadingTime]);

  return (
    <div className={cn('ais-Stats', classNames.root)}>
        <span className={cn('ais-Stats-text', classNames.text)}>{count} results found in {executionTime}ms</span>
    </div>
  );
}

export function StatsSkeleton({ classNames = {} }: { classNames?: Partial<StatsClassNames> }) {
  return (
    <div className={cn('ais-Stats w-full max-w-[200px] h-5 overflow-hidden relative', classNames.root)}>
        <div className={cn('ais-Stats-text w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent', classNames.text)}></div>
    </div>
  );
}
