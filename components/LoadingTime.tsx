'use client';

import { useSearch } from '@/providers/SearchProvider';
import { cn } from '@/utils/cn';

type LoadingTimeClassNames = {
  root: string
};

type Props = {
  classNames?: Partial<LoadingTimeClassNames>
};

export default function LoadingTime({
  classNames = {}
}: Props) {
  const { statsLoadingTime, facetsLoadingTime, hitsLoadingTime } = useSearch();

  return (
    <div className={cn('ais-LoadingTime', classNames.root)}>
      <span>Loading time:</span> 
      <span>{statsLoadingTime}ms (stats)</span> 
      <span>{facetsLoadingTime}ms (facets)</span>
      <span>{hitsLoadingTime}ms (hits)</span>
    </div>
  );
}