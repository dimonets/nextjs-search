'use client';

import React from 'react';
import Image from 'next/image';
import noImage from '@/public/no-image.svg';
import { type Hit as _Hit } from '@/lib/search';

type Props = {
  hit: _Hit,
  view: string,
  query?: string
};

function getDiscount(price: number, salePrice: number): number | null {
  return price > 0 ? Math.floor((price - salePrice) * 100 / price) : 0;
}

export default function Hit({ hit, view }: Props) {
  return (view === 'grid'
    ? <article className="product flex h-full w-full flex-col rounded-none border border-gray-300">
      <div className="items-center flex overflow-x-hidden p-4">
        <label htmlFor={'compare-product-' + hit.id} className="mr-4 flex items-center">
          <input id={'compare-product-' + hit.id} className="ais-compare-checkbox mr-2" type="checkbox" value={hit.id} />
          <span>Compare</span>
        </label>
        <div className="ml-auto flex flex-none items-center space-x-1">
          {hit.on_sale &&
            <span className="flex items-center space-x-1 px-1.5 py-1 bg-gray-500 text-white text-xs uppercase">
              <svg width="15" height="15" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.87109 15.5095C6.68335 15.5095 6.49562 15.4719 6.30789 15.3969C6.12015 15.3218 5.95119 15.2091 5.801 15.0589L0.43179 9.68972C0.281602 9.53953 0.17209 9.3737 0.103254 9.19222C0.034418 9.01075 0 8.82614 0 8.63841C0 8.45067 0.034418 8.26294 0.103254 8.0752C0.17209 7.88747 0.281602 7.71851 0.43179 7.56832L7.04005 0.941286C7.17772 0.803614 7.34043 0.694102 7.52816 0.61275C7.7159 0.531399 7.90989 0.490723 8.11014 0.490723H13.4981C13.9111 0.490723 14.2647 0.637781 14.5588 0.931899C14.8529 1.22602 15 1.57958 15 1.9926V7.38058C15 7.58084 14.9625 7.7717 14.8874 7.95318C14.8123 8.13465 14.7059 8.29423 14.5682 8.4319L7.94118 15.0589C7.79099 15.2091 7.62203 15.3218 7.43429 15.3969C7.24656 15.4719 7.05882 15.5095 6.87109 15.5095ZM11.6208 4.99635C11.9337 4.99635 12.1996 4.88684 12.4186 4.66782C12.6377 4.4488 12.7472 4.18284 12.7472 3.86995C12.7472 3.55706 12.6377 3.2911 12.4186 3.07207C12.1996 2.85305 11.9337 2.74354 11.6208 2.74354C11.3079 2.74354 11.0419 2.85305 10.8229 3.07207C10.6039 3.2911 10.4944 3.55706 10.4944 3.86995C10.4944 4.18284 10.6039 4.4488 10.8229 4.66782C11.0419 4.88684 11.3079 4.99635 11.6208 4.99635Z" fill="white" /></svg>
              <span className="tracking-wider">Sale</span>
            </span>
          }
        </div>
      </div>
      <div className="px-4">
        <div className="pb-full relative mx-auto my-0 flex h-auto w-full overflow-hidden pb-[100%]">
          <figure className="absolute left-0 top-0 h-full w-full">
            <a href="#" className="flex h-full w-full items-center justify-center align-middle">
              {hit.image
                ? <img src={hit.image} alt={hit.name} className="inline-block m-auto w-auto h-auto max-h-full max-w-full relative align-middle" />
                : <Image src={noImage} alt="No Image" className="inline-block m-auto w-auto h-auto max-h-full max-w-full relative align-middle" />
              }
            </a>
          </figure>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 p-4 text-center">
          <div className="mt-2">{hit.brand}</div>
          <h2 className="mt-2 text-lg font-medium">
            <span className="ais-Highlight">
              <span className="ais-Highlight-nonHighlighted">{hit.name}</span>
            </span>
          </h2>

          <div className="mx-auto mt-4 flex space-x-2 items-center justify-center">
            {hit.sale_price && hit.sale_price > 0 ? <s>${hit.price}</s> : <span>${hit.price}</span>}
            {hit.sale_price && hit.sale_price > 0 ? <strong className="font-bold text-gray-700">Save {getDiscount(hit.price, hit.sale_price)}%</strong> : null}
            {hit.sale_price && hit.sale_price > 0 ? <span>${hit.sale_price}</span> : null}
          </div>

          <div className="mx-auto mt-2 flex items-center justify-center space-x-2">
            <span className="flex space-x-0.5 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.floor(hit.rating)
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    : (star - 1 < hit.rating
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        <polygon fill="currentColor" points="12 2 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )
                  }
                </span>
              ))}
            </span>
            <span>({hit.reviews_total})</span>
          </div>
          <div className="mt-2 text-xs">ID: {hit.id}</div>
        </div>
        {hit.free_shipping === true &&
          <div className="mt-4 bg-gray-100 p-2 text-center">Free Shipping</div>
        }
      </div>
    </article>
    : (view === 'list')
      ? <article className="product w-full p-4 border border-gray-300 rounded-none">
        <div className="flex flex-col md:flex-row tems-start space-y-4 md:space-y-0 space-x-0 md:space-x-8">
          <div className="flex-none w-full md:w-auto md:max-w-[240px] lg:max-w-[300px]">
            <div className="flex-none flex items-center space-x-1 mr-4 mb-4">
              {hit.on_sale &&
                <span className="flex items-center space-x-1 px-1.5 py-1 bg-gray-500 text-white text-xs uppercase">
                  <svg width="15" height="15" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.87109 15.5095C6.68335 15.5095 6.49562 15.4719 6.30789 15.3969C6.12015 15.3218 5.95119 15.2091 5.801 15.0589L0.43179 9.68972C0.281602 9.53953 0.17209 9.3737 0.103254 9.19222C0.034418 9.01075 0 8.82614 0 8.63841C0 8.45067 0.034418 8.26294 0.103254 8.0752C0.17209 7.88747 0.281602 7.71851 0.43179 7.56832L7.04005 0.941286C7.17772 0.803614 7.34043 0.694102 7.52816 0.61275C7.7159 0.531399 7.90989 0.490723 8.11014 0.490723H13.4981C13.9111 0.490723 14.2647 0.637781 14.5588 0.931899C14.8529 1.22602 15 1.57958 15 1.9926V7.38058C15 7.58084 14.9625 7.7717 14.8874 7.95318C14.8123 8.13465 14.7059 8.29423 14.5682 8.4319L7.94118 15.0589C7.79099 15.2091 7.62203 15.3218 7.43429 15.3969C7.24656 15.4719 7.05882 15.5095 6.87109 15.5095ZM11.6208 4.99635C11.9337 4.99635 12.1996 4.88684 12.4186 4.66782C12.6377 4.4488 12.7472 4.18284 12.7472 3.86995C12.7472 3.55706 12.6377 3.2911 12.4186 3.07207C12.1996 2.85305 11.9337 2.74354 11.6208 2.74354C11.3079 2.74354 11.0419 2.85305 10.8229 3.07207C10.6039 3.2911 10.4944 3.55706 10.4944 3.86995C10.4944 4.18284 10.6039 4.4488 10.8229 4.66782C11.0419 4.88684 11.3079 4.99635 11.6208 4.99635Z" fill="white" /></svg>
                  <span className="tracking-wider">Sale</span>
                </span>
              }
            </div>
            <div className="w-full md:w-[240px] md:h-[240px] md:max-h-[240px] lg:w-[300px] lg:h-[300px] lg:max-h-[300px]">
              <div className="flex my-0 mx-auto md:pb-full w-full md:h-auto md:overflow-hidden md:pb-[100%] relative">
                <figure className="md:absolute left-0 top-0 w-full h-full">
                  <a href="#" className="w-full h-full flex justify-center items-center align-middle">
                    {hit.image
                      ? <img src={hit.image} alt={hit.name} className="inline-block m-auto w-auto h-auto max-h-full max-w-full relative align-middle" />
                      : <Image src={noImage} alt="No Image" className="inline-block m-auto w-auto h-auto max-h-full max-w-full relative align-middle" />
                    }
                  </a>
                </figure>
              </div>
            </div>
          </div>
          <div className="flex-1 md:!ml-4">
            <div className="mt-2">{hit.brand}</div>
            <h2 className="mt-2 text-lg font-medium">
              <span className="ais-Highlight">
                <span className="ais-Highlight-nonHighlighted">{hit.name}</span>
              </span>
            </h2>

            <div className="mx-auto md:mx-0 mt-2 flex flex-wrap space-x-2 items-center justify-center md:justify-start">
              {hit.sale_price && hit.sale_price > 0 ? <s>${hit.price}</s> : <span>${hit.price}</span>}
              {hit.sale_price && hit.sale_price > 0 ? <strong className="font-bold text-gray-700">Save {getDiscount(hit.price, hit.sale_price)}%</strong> : null}
              {hit.sale_price && hit.sale_price > 0 ? <span>${hit.sale_price}</span> : null}
            </div>

            <div className="mx-auto mt-2 flex space-x-2 items-center">
              <span className="flex space-x-0.5 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= Math.floor(hit.rating)
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      : (star - 1 < hit.rating
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          <polygon fill="currentColor" points="12 2 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )
                    }
                  </span>
                ))}
              </span>
              <span>({hit.reviews_total})</span>
            </div>
            <div className="mt-2 text-xs">ID: {hit.id}</div>
            {hit.free_shipping === true &&
              <div className="mt-4 bg-gray-100 p-2 text-center">Free Shipping</div>
            }
          </div>
          <div className="flex-1 bg-gray-50 px-8 py-4">
            <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center">
              <label htmlFor={`compare-product-${hit.id}`} className="ml-auto flex-none flex items-center order-2 md:order-1 lg:order-2">
                <input id={`compare-product-${hit.id}`} type="checkbox" value={hit.id} className="ais-compare-checkbox mr-2" />
                <span>Compare</span>
              </label>
              <h3 className="text-lg font-medium whitespace-nowrap mr-4 mt-0 md:mt-4 lg:mt-0 order-1 md:order-2 lg:order-1">Product Overview</h3>
            </div>
            <div className="mt-2 leading-6">{hit.description}</div>
            <div className="mt-4 md:flex md:space-x-2">
              <button type="button" className="md:flex-1 flex w-full md:w-auto uppercase px-4 h-10 bg-gray-600 text-white rounded border border-gray-600 cursor-pointer items-center justify-center text-center hover:bg-gray-400 hover:border-gray-400">View Details</button>
            </div>
          </div>
        </div>
      </article>
      : null
  );
}

export function HitSkeleton({ view }: {
  view: string
}) {
  return (view === 'grid'
    ? <article className="product flex min-h-[600px] w-full flex-col rounded-none border border-gray-50 relative isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent">
      <div className="items-center flex p-4">
        <div className="h-4 w-1/3"></div>
      </div>
      <div className="px-4">
        <div className="pb-full relative mx-auto my-0 flex h-auto w-full overflow-hidden pb-[100%]">
          <div className="absolute left-0 top-0 h-full w-full bg-gray-50">
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1 p-4">
          <div className="mx-auto mt-2 h-4 w-1/2 bg-gray-50"></div>
          <div className="mt-2 space-y-2">
            <div className="h-6 w-full bg-gray-100"></div>
            <div className="h-6 w-full bg-gray-100"></div>
            <div className="mx-auto h-6 w-4/5 bg-gray-100"></div>
          </div>
          <div className="mx-auto mt-4 w-3/4 h-4 bg-gray-50"></div>
          <div className="mx-auto mt-2 w-1/2 h-4 bg-gray-50"></div>
          <div className="mx-auto mt-2 w-1/4 h-3 bg-gray-50"></div>
        </div>
      </div>
    </article>
    : <article className="product w-full p-4 border border-gray-50 rounded-none relative isolate overflow-hidden before:absolute before:z-10 before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent">
      <div className="flex flex-col md:flex-row tems-start space-y-4 md:space-y-0 space-x-0 md:space-x-8">
        <div className="flex-none w-full md:w-auto md:max-w-[240px] lg:max-w-[300px]">
          <div className="flex-none flex items-center space-x-1 mr-4 mb-4">
            <div className="flex flex-none w-7 h-7"></div>
          </div>
          <div className="w-full md:w-[240px] md:h-[240px] md:max-h-[240px] lg:w-[300px] lg:h-[300px] lg:max-h-[300px]">
            <div className="flex my-0 mx-auto md:pb-full w-full md:h-auto md:overflow-hidden md:pb-[100%] relative">
              <div className="md:absolute left-0 top-0 w-full h-full bg-gray-50">
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 md:!ml-4">
          <div className="mt-2 h-4 w-1/2 bg-gray-50"></div>
          <div className="mt-2 space-y-2">
            <div className="h-6 w-full bg-gray-100"></div>
            <div className="h-6 w-full bg-gray-100"></div>
            <div className="h-6 w-4/5 bg-gray-100"></div>
          </div>
          <div className="mt-4 w-3/4 h-4 bg-gray-50"></div>
          <div className="mx-auto md:mx-0 mt-2 w-1/2 h-4 bg-gray-50"></div>
          <div className="mt-2 w-1/4 h-3 bg-gray-50"></div>
        </div>
        <div className="flex-1 h-[345px] bg-gray-50 px-8 py-4">
        </div>
      </div>
    </article>
  );
}