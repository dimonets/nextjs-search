import { Suspense } from 'react';
import Stats, { StatsSkeleton } from '@/components/Stats';
import Hits, { HitsSkeleton, ViewButton } from '@/components/Hits';
import Sidebar, { ShowSidebarButton } from '@/components/Sidebar';
import Pagination, { PaginationSkeleton } from '@/components/Pagination';
import SortBy from '@/components/SortBy';
import HitsPerPage from '@/components/HitsPerPage';
import FacetDropdown from '@/components/FacetDropdown';
import { Panel, PanelSkeleton } from '@/components/Panel';
import RefinementList from '@/components/RefinementList';
import CurrentRefinements from '@/components/CurrentRefinements';
import ClearRefinements from '@/components/ClearRefinements';
import LoadingTime from '@/components/LoadingTime';
import { getFacets, getResults, getStats, type SearchProps, type SearchQueryProps } from '@/lib/search';

import { stopwatchWrapper } from '@/utils/stopwatch';

const facets = [{
  attribute: 'categories',
  title: 'Categories'
}, {
  attribute: 'brand',
  title: 'Brand'
}, {
  attribute: 'type',
  title: 'Type'
}, {
  attribute: 'price_range',
  title: 'Price Range'
}, {
  attribute: 'rating',
  title: 'Rating'
}];

export default function Search(props: SearchProps) {
  
  const { sort, page, size, ...queryProps } = props;

  const facetsPromise = stopwatchWrapper(getFacets(queryProps));
  const statsPromise = stopwatchWrapper(getStats(queryProps));
  const hitsPromise = stopwatchWrapper(getResults(props));

  return (
    <div className="group">
      <Sidebar>
        {facets.map((facet) => (
          <Suspense key={`facets-${facet.attribute}-${JSON.stringify(props)}`} fallback={<PanelSkeleton header={facet.title} collapsible={true} classNames={{ header: '!text-gray-300' }} />}>
            <Panel header={facet.title} collapsible={true}>
              {(facet.attribute === 'number_of_bulbs')
                ? <RefinementList attribute={facet.attribute} facetsPromise={facetsPromise} classNames={{
                    root: 'numbers-of-lights',
                    list: 'grid grid-cols-4 gap-4 max-w-64',
                    item: 'flex m-0 p-0',
                    label: 'flex relative m-0 p-0',
                    checkbox: 'peer left-0 top-0 !m-0 !w-full !h-full absolute appearance-none !rounded-none !bg-transparent !bg-none !shadow-none !border-brand-300',
                    labelText: 'w-full py-1 px-2 inline-flex items-center justify-center text-sm font-medium cursor-pointer text-gray-900 focus:outline-none bg-white border border-brand-300 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 bg-blue-50 text-brand-700 peer-hover:bg-gray-100 peer-hover:text-primary-700 peer-checked:bg-gray-100 peer-checked:text-primary-700',
                    count: '!hidden'
                  }} />
                : <RefinementList attribute={facet.attribute} facetsPromise={facetsPromise} />
              }
            </Panel>
          </Suspense>
        ))}
      </Sidebar>
      <div className="group-has-[[data-sidebar-open]]:overflow-hidden group-has-[[data-sidebar-open]]:h-0 group-has-[[data-sidebar-open]]:sm:overflow-auto group-has-[[data-sidebar-open]]:sm:h-auto group">
        <div className="mt-2 items-center md:space-x-4 lg:flex">
          <div className="flex-1">
            <Suspense key={`stats-${JSON.stringify(props)}`} fallback={<StatsSkeleton classNames={{ root: 'flex-none text-center lg:text-left' }} />}>
              <Stats statsPromise={statsPromise} classNames={{ root: 'flex-none text-center lg:text-left' }} />
            </Suspense>
          </div>
          <div className="mt-2 hidden flex-1 items-center space-x-4 lg:mt-0 lg:flex">
            <ViewButton />
            <SortBy />
          </div>
        </div>
        <div className="mt-8 flex items-center space-x-4 lg:mt-4">
          <ShowSidebarButton />
          <div className="hidden lg:flex lg:w-full lg:items-center lg:space-x-4">
            {facets.map((facet) => (
              <div key={`facets-${facet.attribute}`} className="flex-1">
                <Suspense key={`facets-${facet.attribute}-${JSON.stringify(props)}`} fallback={<FacetDropdown title={facet.title} isRefined={props[facet.attribute as keyof SearchQueryProps] ? true : false} isDisabled={true} classNames={{ root: 'w-full overflow-hidden relative', button: 'w-full whitespace-nowrap !cursor-default isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-50 before:to-transparent'}} />}>
                  <FacetDropdown title={facet.title} isRefined={props[facet.attribute as keyof SearchQueryProps] ? true : false} classNames={{ root: 'flex-1', button: 'w-full whitespace-nowrap'}}>
                    {(facet.attribute === 'number_of_bulbs')
                      ? <RefinementList attribute={facet.attribute} facetsPromise={facetsPromise} classNames={{
                          root: 'numbers-of-lights',
                          list: 'grid grid-cols-4 gap-4 max-w-64',
                          item: 'flex m-0 p-0',
                          label: 'flex relative m-0 p-0',
                          checkbox: 'peer left-0 top-0 !m-0 !w-full !h-full absolute appearance-none !rounded-none !bg-transparent !bg-none !shadow-none !border-brand-300',
                          labelText: 'w-full py-1 px-2 inline-flex items-center justify-center text-sm font-medium cursor-pointer text-gray-900 focus:outline-none bg-white border border-brand-300 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 bg-blue-50 text-brand-700 peer-hover:bg-gray-100 peer-hover:text-primary-700 peer-checked:bg-gray-100 peer-checked:text-primary-700',
                          count: '!hidden'
                        }} />
                      : <RefinementList attribute={facet.attribute} facetsPromise={facetsPromise} />
                    }
                  </FacetDropdown>
                </Suspense>
              </div>
            ))}
          </div>
        </div>
        {(Object.values(queryProps).filter((v) => Array.isArray(v)).length > 0) &&
          <div className="mt-8 lg:mt-4 mb-4 flex flex-col items-center lg:flex-row lg:flex-wrap">
            <CurrentRefinements props={queryProps} classNames={{ 
              root: 'mt-4 inline-flex justify-center order-2 lg:order-4 lg:flex-grow lg:justify-start', 
              list: '!inline-flex space-x-2 justify-center !flex-wrap lg:justify-start', 
              item: '!px-0 !inline-flex !flex-wrap !space-x-2 justify-center !bg-none !bg-transparent !border-none', 
              label: '!my-1',
              category: '!inline-block !mx-0 !my-1 !px-2 !py-1 !rounded-full !bg-gray-100 !border-gray-100 whitespace-nowrap max-w-full' 
            }} />
            <div className="whitespace-nowrap text-center order-1 lg:flex-none lg:order-1">Applied Filters</div>
            <ClearRefinements buttonText="Clear All Filters" classNames={{ root: 'mt-2 flex items-center space-x-4 justify-center order-3 lg:mt-0 lg:order-2 lg:justify-start lg:ml-4', button: '!inline !px-0 !w-auto !text-base !bg-none !border-none !shadow-none !text-brand-300 !underline !hover:text-brand-600' }} />
            <div className="lg:order-3 lg:basis-full lg:h-0"></div>
          </div>
        }

        <Suspense key={`hits-${JSON.stringify(props)}`} fallback={<HitsSkeleton />}>
          <Hits hitsPromise={hitsPromise} query={props.query} />
        </Suspense>

        <div className="mt-4 flex flex-col items-center lg:flex-row lg:space-x-4">
          <Suspense key={`pagination-${JSON.stringify(props)}`} fallback={<PaginationSkeleton classNames={{ 
            root: 'mt-4 lg:mt-0 mx-auto lg:mx-0 flex-shrink order-2 lg:order-1 justify-center lg:justify-start overflow-hidden relative', 
            list: 'isolate overflow-hidden before:h-8 before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-50 before:to-transparent'
          }} />}>
            <Pagination statsPromise={statsPromise} pageSize={props.size} currentPage={props.page} classNames={{ 
              root: 'mt-4 lg:mt-0 mx-auto lg:mx-0 flex-shrink order-2 lg:order-1 justify-center lg:justify-start', 
            }} />
          </Suspense>
          <div className="order-1 flex flex-auto flex-col items-center justify-center lg:justify-end space-x-4 md:flex-row lg:order-2 lg:ml-auto">
            <Suspense key={`stats-${JSON.stringify(props)}`} fallback={<StatsSkeleton classNames={{ root: 'mt-2 md:mt-0 flex-none order-2 md:order-1' }} />}>
              <Stats statsPromise={statsPromise} classNames={{ root: 'mt-2 md:mt-0 flex-none order-2 md:order-1' }} />
            </Suspense>
            <HitsPerPage classNames={{ root: 'flex-none ml-auto lg:ml-0 order-1 md:order-2' }} />
          </div>
        </div>

        <LoadingTime classNames={{ root: 'mt-4 mx-auto flex space-x-2 italic text-xs justify-center lg:mx-0 lg:justify-start' }}/>
      </div>
    </div>
  );
}
