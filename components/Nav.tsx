import Link from 'next/link';

export default function Nav() {
  return (
    <nav
      className="border-t-solid hidden w-full border-t border-t-gray-300 px-4 md:flex md:w-auto xl:px-16"
      id="navbar-default"
    >
      <ul className="mt-4 flex flex-col border border-gray-100 bg-gray-50 px-4 py-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white xl:px-0">
        <li key="0">
          <Link href="/" className="hover:text-brand-400 block text-gray-700" title="Link 1">
            Link 1
          </Link>
        </li>
        <li key="1">
          <Link href="/" className="hover:text-brand-400 block text-gray-700" title="Link 2">
            Link 2
          </Link>
        </li>
        <li key="2">
          <Link href="/" className="hover:text-brand-400 block text-gray-700" title="Link 3">
            Link 3
          </Link>
        </li>
        <li key="3">
          <Link href="/" className="hover:text-brand-400 block text-gray-700" title="Link 4">
            Link 4
          </Link>
        </li>
        <li key="4">
          <Link href="/" className="hover:text-brand-400 block text-gray-700" title="Link 5">
            Link 5
          </Link>
        </li>
      </ul>
      <ul className="ml-auto mt-4 flex flex-col bg-gray-50 px-4 py-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white xl:px-0">
        <li key="0">
          <Link href="/" className="text-brand-400 hover:text-brand-600 block" title="Link 6">
            Link 6
          </Link>
        </li>
        <li key="1">
          <Link href="/" className="text-brand-400 hover:text-brand-600 block" title="Link 7">
            Link 7
          </Link>
        </li>
        <li key="2">
          <Link href="/" className="text-brand-400 hover:text-brand-600 block" title="Link 8">
            Link 8
          </Link>
        </li>
      </ul>
    </nav>
  );
}
