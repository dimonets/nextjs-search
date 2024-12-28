'use client';

import Form from 'next/form';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition, useRef } from 'react';
import SearchStatus from './SearchStatus';
import { cn } from '@/utils/cn';

type AutocompleteClassNames = {
  root: string,
  label: string,
  input: string
};

type Props = {
  classNames?: Partial<AutocompleteClassNames>
};

function debouncePromise(fn: (e: React.ChangeEvent<HTMLInputElement>) => void, time: number) {
  let timer: NodeJS.Timeout | string | number | undefined = undefined;

  return function debounced(arg: React.ChangeEvent<HTMLInputElement>) {
    if (timer)
      clearTimeout(timer); // Clear the timeout first if it's already defined.

    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(arg)), time);
    });
  };
}

export default function Autocomplete({
  classNames = {}
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [isPending, startTransition] = useTransition();

  // Temporary disable eslint compiler rule because of use ref in render bug https://github.com/facebook/react/pull/30843/files
  // eslint-disable-next-line react-compiler/react-compiler
  const onChangeDebounced = useRef(
    debouncePromise(async (e: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        console.log(searchParams);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('page');
        if (e.target.value && typeof e.target.value === 'string' && e.target.value.length > 0)
          newSearchParams.set('query', e.target.value);
        else
          newSearchParams.delete('query');
        router.push(`?${newSearchParams.toString()}`, {
          scroll: false,
        });
      });
    }, 350)
  ).current;

  return (
    <Form action="/" className={cn('ais-Autocomplete', classNames.root)} role="search">
      <label className={cn('ais-Autocomplete-label', classNames.label)} htmlFor="search">
        Search
      </label>
      <input
        autoComplete="off"
        id="search"
        onChange={onChangeDebounced}
        defaultValue={query}
        className={cn('ais-Autocomplete-input', classNames.input)}
        name="query"
        placeholder="Search in product title or brand name..."
        type="search"
      />
      <SearchStatus searching={isPending} />
    </Form>
  );
}

export function AutocompleteSkeleton({
  classNames = {}
}: Props) {
  return (
    <Form action="/" className={cn('ais-Autocomplete', classNames.root)} role="search">
      <label className={cn('ais-Autocomplete-label', classNames.label)} htmlFor="search">
        Search
      </label>
      <input
        autoComplete="off"
        id="search"
        defaultValue=""
        className={cn('ais-Autocomplete-input ais-Autocomplete-input--disabled', classNames.input)}
        name="query"
        placeholder="Search in product title or brand name..."
        type="search"
        disabled={true}
      />
    </Form>
  );
}