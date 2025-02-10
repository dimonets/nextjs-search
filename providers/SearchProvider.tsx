'use client';

import { createContext, ReactNode, useContext, useMemo, useState, PropsWithChildren } from 'react';

interface SearchContext {
  showSidebar: boolean,
  setShowSidebar: (newValue: boolean) => void,
  view: string,
  setView: (newValue: string) => void,
}

const SearchContext = createContext<SearchContext | undefined>(undefined);

export default function SearchProvider({ defaultView, children }: PropsWithChildren<{
    defaultView?: string
  }>) {
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [view, setView] = useState(defaultView || 'grid');

  const value = useMemo(
    () => ({ 
      showSidebar, 
      setShowSidebar, 
      view, 
      setView, 
    }),
    [showSidebar, view],
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