'use client';

import {
  ComponentProps,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useState,
  useEffect
} from 'react';

import { cn } from '@/utils/cn';

type PanelProps = ComponentProps<'div'> &
  PropsWithChildren<{
    header?: string | ReactNode,
    footer?: string | ReactNode,
    classNames?: Partial<PanelClassNames>,
    collapsible?: boolean
  }>;

type PanelClassNames = {
  root: string,
  header: string,
  body: string,
  footer: string
};

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, header, footer, className, classNames = {}, collapsible = false, ...props }, ref) => {

    const facetId = header ? header.toString().replace(/[^a-zA-Z0-9\s]/g, '') : '';
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      if (typeof (Storage) !== 'undefined')
        setExpanded(localStorage.getItem('facet-' + facetId + '-panel-expanded') === '1' ? true : false);
    }, [facetId]);

    function toggleExpanded() {
      const currentValue = expanded;
      setExpanded(!currentValue);

      if (typeof (Storage) !== 'undefined')
        localStorage.setItem('facet-' + facetId + '-panel-expanded', currentValue ? '0' : '1');
    }

    return (
      <div
        {...props}
        className={cn('ais-Panel', classNames.root, className)}
        ref={ref}
      >
        {header && (
          collapsible 
          ? <div className={cn('ais-Panel-header', classNames.header)} onClick={() => toggleExpanded()}>
              <span>{header}</span><span>{ expanded ? '–' : '+'}</span>
            </div> 
          : <div className={cn('ais-Panel-header', classNames.header)}>
              {header}
            </div>
        )}
        <div className={expanded || !collapsible ? cn('ais-Panel-body', classNames.body) : 'hidden'}>{children}</div>
        {footer && (
          <div className={expanded || !collapsible ? cn('ais-Panel-footer', classNames.footer) : 'hidden'}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Panel.displayName = 'Panel';

export function PanelSkeleton({ header, footer, classNames = {}, collapsible = false }: PanelProps) {
  const facetId = header ? header.toString().replace(/[^a-zA-Z0-9\s]/g, '') : '';
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (typeof (Storage) !== 'undefined')
      setExpanded(localStorage.getItem('facet-' + facetId + '-panel-expanded') === '1' ? true : false);
  }, [facetId]);

  return (
    <div className={cn('ais-Panel', classNames.root)}>
      {header && (
        collapsible 
        ? <div className={cn('ais-Panel-header', classNames.header)}>
            <span>{header}</span><span>{ expanded ? '–' : '+'}</span>
          </div> 
        : <div className={cn('ais-Panel-header', classNames.header)}>
            {header}
          </div>
      )}
      <div className={expanded || !collapsible ? cn('ais-Panel-body flex flex-col space-y-4', classNames.body) : 'hidden'}>
        <div className="w-[200px] h-5 overflow-hidden flex-none relative">
            <div className="w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent"></div>
        </div>
        <div className="w-[200px] h-5 overflow-hidden flex-none relative">
            <div className="w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent"></div>
        </div>
        <div className="w-[200px] h-5 overflow-hidden flex-none relative">
            <div className="w-full h-full bg-gray-50 isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent"></div>
        </div>
      </div>
      {footer && (
        <div className={expanded || !collapsible ? cn('ais-Panel-footer', classNames.footer) : 'hidden'}>
          {footer}
        </div>
      )}
    </div>
  );
}