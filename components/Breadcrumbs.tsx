import Link from 'next/link';

export default function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb">
      <ul className="div-breadcrumb flex flex-wrap items-center justify-center py-4 text-base font-normal leading-8 tracking-tight text-gray-500 sm:justify-center md:justify-center lg:justify-start">
        <li key={0} className="flex items-center">
          <Link href="/" className="hover:text-brand-400">
            Home
          </Link>
          <span className="mx-1"> / </span>
        </li>
        <li key={1} className="flex items-center">
          <span className="hover:text-primary text-brand-400 font-medium" aria-current="page">
            Search
          </span>
        </li>
      </ul>
    </nav>
  );
}
