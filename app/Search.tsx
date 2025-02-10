import { Suspense } from 'react';
import Hits, { HitsSkeleton } from '@/components/Hits';
import { getResults } from '@/lib/search';

import { stopwatchWrapper } from '@/utils/stopwatch';

export default async function Search() {
  const hitsPromise = stopwatchWrapper(getResults());
  return (
    <Suspense key={`hits`} fallback={<HitsSkeleton />}>
      <Hits hitsPromise={hitsPromise} />
    </Suspense>
  );
}
