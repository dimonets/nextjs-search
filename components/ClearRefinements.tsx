'use client';

import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { cn } from '@/utils/cn';

type ClearRefinementsClassNames = {
  root: string,
  button: string
};

type Props = {
  buttonText?: string,
  disabled?: boolean,
  classNames?: Partial<ClearRefinementsClassNames>
};

export default function ClearRefinements({ buttonText, disabled = false, classNames = {} }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn('ais-ClearRefinements', classNames.root)}>
      <button type="button" className={cn(
          'ais-ClearRefinements-button', 
          disabled ? 'ais-ClearRefinements-button--disabled' : '',
          classNames.button
        )}
        disabled={disabled || undefined}
        onClick={() => {
          startTransition(() => {
            const newSearchParams = new URLSearchParams();
            router.push(`?${newSearchParams.toString()}`, {
              scroll: false,
            });
          });
        }}
      >{buttonText ?? 'Clear refinements'}</button>
    </div>
  )
}