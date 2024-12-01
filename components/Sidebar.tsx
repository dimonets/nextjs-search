'use client';

import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';
import { useSearch } from '@/providers/SearchProvider';
import SortBy from '@/components/SortBy';

export default function Sidebar({ children }: PropsWithChildren) {
  const { showSidebar, setShowSidebar } = useSearch();

  return (
    <>
      {showSidebar && (
        <div
          className="pointer-events-auto fixed inset-0 z-[9995] hidden h-full w-full bg-black bg-opacity-60 opacity-100 backdrop-blur-sm sm:block"
          onClick={() => {
            return setShowSidebar(false);
          }}
        ></div>
      )}
      <aside
        className={cn(
          'facets pointer-events-auto fixed left-0 top-0 z-[9999] box-border h-screen max-h-full w-full overflow-y-auto bg-white p-4 duration-300 ease-in-out sm:max-w-[320px]',
          showSidebar ? 'shadow-blue-gray-900/10 translate-x-0 shadow-2xl' : '-translate-x-full',
        )}
        data-sidebar-open={showSidebar ? '' : undefined}
      >
        <button type="button" onClick={() => setShowSidebar(false)} className="mx-auto flex text-xl justify-center">✕</button>
        <h3 className="text-center text-2xl medium">Filter and Sort</h3>
        <button type="button" className="mt-4 block md:hidden w-full text-center space-x-2 px-4 h-10 bg-gray-600 uppercase text-white rounded border border-gray-600 cursor-pointer" onClick={() => setShowSidebar(false)}>View Results</button>
        <div className="mt-4 flex flex-col">
          <div className="order-2 mt-4">
            {children}
          </div>
          <SortBy classNames={{ root: 'order-1' }} />
        </div>
      </aside>
    </>
  );
}

export function ShowSidebarButton() {
  const { setShowSidebar  } = useSearch();
  return (
    <>
      <button
        type="button"
        className="flex h-10 w-full cursor-pointer items-center justify-center space-x-2 whitespace-nowrap rounded border border-gray-600 bg-gray-600 px-4 uppercase text-white hover:border-gray-400 hover:bg-gray-400 lg:w-auto"
        onClick={() => {
          return setShowSidebar(true);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
        <span className="hidden lg:inline">All Filters</span>
        <span className="inline lg:hidden">Filter And Sort</span>
      </button>
    </>
  );
}