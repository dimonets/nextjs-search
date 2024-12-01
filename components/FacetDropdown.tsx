'use client';

import {
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Panel } from './Panel';
import { useCloseDropdown } from '../hooks/UseCloseDropdown';
import { cn } from '@/utils/cn';

type FacetDropdownClassNames = {
  root: string,
  button: string
};

export default function FacetDropdown({
  children,
  title,
  isRefined,
  isDisabled,
  classNames = {}
}: PropsWithChildren<{
  title?: string,
  isRefined?: boolean,
  isDisabled?: boolean,
  classNames?: Partial<FacetDropdownClassNames>,
}>) {
  const [isOpened, setIsOpened] = useState(false);
  const panelRef = useRef(null);

  const close = useCallback(() => setIsOpened(false), []);

  useCloseDropdown(panelRef, close, isOpened);

  const header = (
    <button
      type="button"
      className={cn(
        'ais-Dropdown-button',
        classNames.button,
        isRefined && 'ais-Dropdown-button--refined',
        isDisabled && 'ais-Dropdown-button--disabled'
      )}
      disabled={isDisabled}
      onClick={() => setIsOpened((opened) => !opened)}
    >
      <span>{title}</span>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.41 0.290039L6 4.88004L10.59 0.290039L12 1.71004L6 7.71004L0 1.71004L1.41 0.290039Z" fill="currentColor" /></svg>
    </button>
  );

  return (
    <Panel
      header={header}
      classNames={{
        root: cn(
          'ais-Dropdown',
          isOpened && 'ais-Dropdown--opened',
          classNames.root
        ),
        body: 'overflow-x-hidden overflow-y-auto w-[260px] max-h-[320px]'
      }}
      ref={panelRef}
    >
      {children}
    </Panel>
  );
}