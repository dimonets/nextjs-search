import { Suspense } from 'react';
import Stats, { StatsSkeleton } from '@/components/Stats';
import Hits, { HitsSkeleton } from '@/components/Hits';
import Pagination, { PaginationSkeleton } from '@/components/Pagination';
import { getResults, getStats, type SearchProps, type SearchQueryProps } from '@/lib/search';

import { stopwatchWrapper } from '@/utils/stopwatch';

export default async function Search(props: SearchProps) {
  const { page, size, ...queryProps } = props;

  const statsPromise = stopwatchWrapper(getStats(queryProps));
  const hitsPromise = stopwatchWrapper(getResults(props));
  return (
    <div>
      <div className="mt-2 items-center md:space-x-4 lg:flex">
        <div className="flex-1">
          <Suspense
            key={`stats`}
            fallback={<StatsSkeleton classNames={{ root: 'flex-none text-center lg:text-left' }} />}
          >
            <Stats statsPromise={statsPromise} classNames={{ root: 'flex-none text-center lg:text-left' }} />
          </Suspense>
        </div>
      </div>

      <Suspense key={`hits`} fallback={<HitsSkeleton />}>
        <Hits hitsPromise={hitsPromise} query={props.query} />
      </Suspense>

      <div className="mt-4 flex flex-col items-center lg:flex-row lg:space-x-4">
        <Suspense
          key={`pagination`}
          fallback={
            <PaginationSkeleton
              classNames={{
                root: 'mt-4 lg:mt-0 mx-auto lg:mx-0 flex-shrink order-2 lg:order-1 justify-center lg:justify-start overflow-hidden relative',
                list: 'isolate overflow-hidden before:h-8 before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-50 before:to-transparent',
              }}
            />
          }
        >
          <Pagination
            statsPromise={statsPromise}
            pageSize={size}
            currentPage={page}
            classNames={{
              root: 'mt-4 lg:mt-0 mx-auto lg:mx-0 flex-shrink order-2 lg:order-1 justify-center lg:justify-start',
            }}
          />
        </Suspense>
        <div className="order-1 flex flex-auto flex-col items-center justify-center space-x-4 md:flex-row lg:order-2 lg:ml-auto lg:justify-end">
          <Suspense
            key={`stats`}
            fallback={<StatsSkeleton classNames={{ root: 'mt-2 md:mt-0 flex-none order-2 md:order-1' }} />}
          >
            <Stats statsPromise={statsPromise} classNames={{ root: 'mt-2 md:mt-0 flex-none order-2 md:order-1' }} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
