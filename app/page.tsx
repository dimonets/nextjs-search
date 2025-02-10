import Breadcrumbs from '@/components/Breadcrumbs';
import Search from './Search';
import { type SearchProps } from '@/lib/search';

export const experimental_ppr = true;

type PageProps = {
  searchParams: Promise<SearchProps>;
};

export default async function Home({ searchParams }: PageProps) {
  const { page, size } = await searchParams;

  return (
    <>
      <Breadcrumbs />
      <h1 className="mt-2 text-xl font-medium text-center lg:text-left">Search</h1>
      <Search 
        page={ Number(page) || 1 } 
        size={ Number(size) || 10 } 
      />
    </>
  );
}