import { cookies } from 'next/headers';
import Breadcrumbs from '@/components/Breadcrumbs';
import Search from './Search';
import SearchProvider from '@/providers/SearchProvider';
import { type SearchProps } from '@/lib/search';

// EDGE Runtime is not working with pg
//export const runtime = 'edge';

type PageProps = {
  //params: Promise<any>;
  searchParams: Promise<SearchProps>;
};

export default async function Home({ searchParams }: PageProps) {
  const { query, categories, brand, type, price_range, rating, sort, page, size } = await searchParams;

  const cookieStore = await cookies();
  const defaultView = cookieStore.get('hits-view');

  return (
    <>
      <Breadcrumbs />
      <h1 className="mt-2 text-xl font-medium text-center lg:text-left">Search</h1>
      <SearchProvider defaultView={defaultView?.value}>
        <Search 
          query={ query } 
          categories={ Array.isArray(categories) ? categories.map(String) : categories ? [String(categories)] : undefined } 
          brand={ Array.isArray(brand) ? brand.map(String) : brand ? [String(brand)] : undefined } 
          type={ Array.isArray(type) ? type.map(String) : type ? [String(type)] : undefined } 
          price_range={ Array.isArray(price_range) ? price_range.map(String) : price_range ? [String(price_range)] : undefined } 
          rating={ Array.isArray(rating) ? rating.map(Number) : rating ? [Number(rating)] : undefined } 
          sort={ sort } 
          page={ Number(page) || 1 } 
          size={ Number(size) || 10 } 
        />
      </SearchProvider>
    </>
  );
}
