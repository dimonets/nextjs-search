'use client';

import { createContext, ReactNode, useContext, useMemo, useState, PropsWithChildren } from 'react';

interface SearchContext {
  view: string,
  setView: (newValue: string) => void,
}

const SearchContext = createContext<SearchContext | undefined>(undefined);

export default function SearchProvider({ defaultView, children }: PropsWithChildren<{
    defaultView?: string
  }>) {
  
  const [view, setView] = useState(defaultView || 'grid');

  const value = useMemo(
    () => ({ 
      view, 
      setView, 
    }),
    [view],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
}