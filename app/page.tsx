import Breadcrumbs from '@/components/Breadcrumbs';
import Search from './Search';

export const experimental_ppr = true;

export default async function Home() {
  return (
    <>
      <Breadcrumbs />
      <h1 className="mt-2 text-xl font-medium text-center lg:text-left">Search</h1>
      <Search />
    </>
  );
}