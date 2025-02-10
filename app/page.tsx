import { cookies } from 'next/headers';
import Breadcrumbs from '@/components/Breadcrumbs';
import Search from './Search';
import SearchProvider from '@/providers/SearchProvider';
import { type SearchProps } from '@/lib/search';

export const experimental_ppr = true;

type PageProps = {
  searchParams: Promise<SearchProps>;
};

export default async function Home({ searchParams }: PageProps) {
  const { query, sort, page, size } = await searchParams;

  const cookieStore = await cookies();
  const defaultView = cookieStore.get('hits-view');

  return (
    <>
      <Breadcrumbs />
      <h1 className="mt-2 text-xl font-medium text-center lg:text-left">Search</h1>
      <SearchProvider defaultView={defaultView?.value}>
        <Search 
          query={ query } 
          sort={ sort } 
          page={ Number(page) || 1 } 
          size={ Number(size) || 10 } 
        />
      </SearchProvider>
    </>
  );
}