'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { type SearchQueryProps } from '@/lib/search';
import { cn } from '@/utils/cn';

type CurrentRefinementsClassNames = {
  root: string,
  list: string,
  item: string,
  label: string,
  category: string,
  categoryLabel: string,
  delete: string
};

type Props = {
  props: SearchQueryProps,
  classNames?: Partial<CurrentRefinementsClassNames>
};

type DynamicObject = {
  [key: string]: string;
};

const labels: DynamicObject = {
  'query': 'Query',
  'categories': 'Categories',
  'brand': 'Brand',
  'type': 'Type',
  'price_range': 'Price Range',
  'rating': 'Rating'
};

export default function CurrentRefinements({ classNames = {}, props }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const noRefinement = Object.values(props).filter((v) => Array.isArray(v)).length === 0;
  return (
    <div className={cn(
      'ais-CurrentRefinements',
      noRefinement ? 'ais-CurrentRefinements--noRefinement' : '',
      classNames?.root,
    )}>
      <ul className={cn(
        'ais-CurrentRefinements-list',
        noRefinement ? 'ais-CurrentRefinements-list--noRefinement' : '',
        classNames?.list,
      )}>
        {!noRefinement && Object.keys(props).filter((key: string) => Array.isArray(props[key as keyof SearchQueryProps])).map((item: string) => (
          <li key={item} className={cn(
            'ais-CurrentRefinements-item',
            classNames?.item,
          )}>
            <span className={cn(
              'ais-CurrentRefinements-label',
              classNames?.label,
            )}>{labels[item] ?? item}:</span>
            {(props[item as keyof SearchQueryProps] as string[]).map((refinement: string) => (
              <span key={refinement} className={cn(
                'ais-CurrentRefinements-category',
                classNames?.category,
              )}>
                <span className={cn(
                  'ais-CurrentRefinements-categoryLabel',
                  classNames?.categoryLabel,
                )}>{refinement}</span>
                <button
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      const newSearchParams = new URLSearchParams(searchParams.toString());

                      //newSearchParams.delete(item, refinement); // <-- doesn't work correctly
                      const values = newSearchParams.getAll(item);
                      if (values.length) {
                        newSearchParams.delete(item);
                        for (const value of values) {
                          if (value !== refinement)
                            newSearchParams.append(item, value);
                        }
                      }

                      router.push(`?${newSearchParams.toString()}`, {
                        scroll: false,
                      });
                    });
                  }}
                  className={cn(
                    'ais-CurrentRefinements-delete',
                    classNames?.delete,
                  )}
                >✕</button>
              </span>
            ))}
  
          </li>
        ))}
      </ul>
    </div>
  )
}