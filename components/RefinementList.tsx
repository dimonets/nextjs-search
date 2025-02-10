'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { use, useOptimistic, useTransition, useEffect } from 'react';
import { type Facet } from '@/lib/search';
import { cn } from '@/utils/cn';

type RefinementListClassNames = {
  root: string,
  list: string,
  item: string,
  label: string,
  checkbox: string,
  labelText: string,
  count: string
};

type Props = {
  attribute: string,
  facetsPromise: Promise<{ facets: Facet[], executionTime: number }>,
  classNames?: Partial<RefinementListClassNames>
};

export default function RefinementList({ attribute, facetsPromise, classNames = {} }: Props) {
  const { facets, executionTime } = use(facetsPromise);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticValues, setOptimisticValues] = useOptimistic(searchParams.getAll(attribute));

  function handleChange(attribute: string, newValues: string[]) {
    const params = new URLSearchParams(searchParams);
    params.delete(attribute);
    params.delete('page');
    newValues.forEach((value: string) => {
      return params.append(attribute, value);
    });

    startTransition(() => {
      setOptimisticValues(newValues);
      router.push(`?${params.toString()}`, {
        scroll: false
      });
    });
  }

  return (
    <div key={attribute} data-pending={isPending ? '' : undefined} className={cn('ais-RefinementList', classNames.root)}>
      <ul className={cn('ais-RefinementList-list', classNames.list)}>
        {facets.filter((facet: Facet) => facet.attribute === attribute).sort((a: Facet, b: Facet) => {
          if (attribute === 'rating') {
            return a.value.localeCompare(b.value);
          } else if (attribute === 'price_range') {
            const aParts = a.value.split(' ');
            const bParts = b.value.split(' ');

            const aValue = aParts.length == 3 
              ? Number(aParts[0])
              : aParts.length == 2
                ? Number(aParts[1])
                : 0;

            const bValue = bParts.length == 3 
              ? Number(bParts[0])
              : bParts.length == 2
                ? Number(bParts[1])
                : 0;

            return aValue - bValue;
          } else {
            return b.count - a.count;
          }
        }).filter((facet: Facet, index: number) => index <= 10).map((facet: Facet) => {
          const isActive = optimisticValues.includes(facet.value.toString());
          return (
          <li key={facet.value} className={cn(
              'ais-RefinementList-item', 
              isActive ? 'ais-RefinementList-item--selected' : '',
              classNames.item
            )}>
            <label className={cn('ais-RefinementList-label', classNames.label)}>
              <input className={cn('ais-RefinementList-checkbox', classNames.checkbox)} type="checkbox" value={facet.value} onChange={() => {
                handleChange(facet.attribute, 
                  isActive
                  ? optimisticValues.filter(selectedValue => {
                      return selectedValue !== facet.value;
                    })
                  : [...optimisticValues, facet.value]
                );
              }} checked={isActive} />
              <span className={cn('ais-RefinementList-labelText', classNames.labelText)}>{facet.value}</span>
              <span className={cn('ais-RefinementList-count', classNames.count)}>{facet.count}</span>
            </label>
          </li>
          )
        })}
      </ul>
    </div>
  );
}