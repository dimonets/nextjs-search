import 'server-only';

import { dbQuery } from '@/db/index';
import { unstable_cacheLife as cacheLife } from 'next/cache'
//import { unstable_cache } from 'next/cache';
//import { slow } from '@/utils/slow';

export type SearchQueryProps = {
  query: string,
  categories?: string | string[],
  brand?: string | string[],
  type?: string | string[],
  price_range?: string | string[],
  rating?: number | number[]
}

export interface SearchProps extends SearchQueryProps {
  sort: string,
  page: number,
  size: number
}

export type Facet = {
  attribute: string,
  value: string,
  count: number
}

export type Hit = {
  id: number,
  name: string,
  brand: string,
  image: string,
  description: string,
  price: number,
  sale_price: number,
  on_sale: boolean,
  on_clearance: boolean,
  price_range: string,
  free_shipping: boolean,
  rating: number,
  reviews_total: number,
  categories: string[],
  type: string
}

export type Stat = {
  count: number
}

//export const getFacets = unstable_cache(async (props: SearchQueryProps): Promise<{ facets: Facet[] }> => {
export async function getFacets(props: SearchQueryProps): Promise<{ facets: Facet[] }> {
  'use cache';
  cacheLife('hours');

  //console.log('getFacets', new Date().toLocaleTimeString());

  const conditions: string[] = [],
      conditions2: string[] = [],
      conditions3: string[] = [],
      conditions4: string[] = [],
      values: string[] = [];

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      const and: string[] = [];
      const and2: string[] = [];
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ''${key}\\:' || $${(values.length + 1)} || '''::tsquery)`);
        values.push(typeof item === 'string' ? item.replace(/\s/g,"\\ ").replace(/\&/g,"\\&") : item.toString());
        if (!props['query']) {
          and.push(`split_part(word, ':', 2) = $${(values.length + 1)}`);
          and2.push(`split_part(word, ':', 2) <> $${(values.length + 1)}`);
          values.push(typeof item === 'string' ? item : item.toString());
        }
      });
      conditions.push('(' + or.join(' OR ') + ')');
      if (!props['query']) {
        conditions2.push(`(split_part(word, ':', 1) = '${key}'` + " AND (" + and.join(' OR ') + '))');
        conditions3.push(`(split_part(word, ':', 1) <> '${key}')`);
        conditions4.push(`(split_part(word, ':', 1) = '${key}'` + " AND " + and2.join(' AND ') + ')');
      }
    } else if (key === 'query' && props[key]) {
      // TODO: This needs to be improved to protect from SQL injections
      conditions.push('((LOWER(brand) LIKE \'\'%' + props[key].toLowerCase() + '%\'\') OR (LOWER(name) LIKE \'\'%' + props[key].toLowerCase() + '%\'\'))');
      //conditions.push(`((LOWER(brand) LIKE $${(values.length + 1)}) OR (LOWER(name) LIKE $${(values.length + 1)}))`);
      //values.push(props[key].toLowerCase() + '%');
    }
  });

  const sql = conditions4.length == 2
    ? "SELECT split_part(word, ':', 1) AS attribute, split_part(word, ':', 2) AS value, ndoc AS count FROM ts_stat('SELECT tsv FROM products WHERE " + conditions.join(' AND ') + "') WHERE (" + conditions2.join(' OR ') + ") OR (" + conditions3.join(' AND ') + ") UNION DISTINCT SELECT split_part(word, ':', 1) AS attribute, split_part(word, ':', 2) AS value, ndoc AS count FROM ts_stat('SELECT tsv FROM products WHERE " + conditions.join(' OR ') + "') WHERE (" + conditions4.join(' OR ') + ") ORDER BY count DESC, value ASC"
    : conditions4.length == 1 
      ? "SELECT split_part(word, ':', 1) AS attribute, split_part(word, ':', 2) AS value, ndoc AS count FROM ts_stat('SELECT tsv FROM products WHERE " + conditions.join(' AND ') + "') WHERE (" + conditions2.join(' OR ') + ") OR (" + conditions3.join(' AND ') + ") UNION DISTINCT SELECT split_part(word, ':', 1) AS attribute, split_part(word, ':', 2) AS value, ndoc AS count FROM ts_stat('SELECT tsv FROM products') WHERE (" + conditions4.join(' OR ') + ") ORDER BY count DESC, value ASC"
      : "SELECT split_part(word, ':', 1) AS attribute, split_part(word, ':', 2) AS value, ndoc AS count FROM ts_stat('SELECT tsv FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + "') ORDER BY count DESC, value ASC";

  //console.log(sql);

  const { rows } = await dbQuery<Facet>(sql, values);

  //await slow(2000);

  return { facets: rows };
}
/*
  },
  ['facets'],
  { revalidate: 3600, tags: ['facets'] }
);
*/

export async function getResults(props: SearchProps): Promise<{ hits: Hit[] }> {
  'use cache';
  cacheLife('hours');

  //console.log('getResults', new Date().toLocaleTimeString());

  const conditions: string[] = [],
      values: string[] = [];

  let sort: string = 'ORDER BY is_featured DESC NULLS LAST, id DESC';

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchProps])) {
      const or: string[] = [];
      (props[key as keyof SearchProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ('${key}\\:' || $${(values.length + 1)})::tsquery)`);
        values.push(typeof item === 'string' ? item.replace(/\s/g,"\\ ").replace(/\&/g,"\\&") : item.toString());
      });
      conditions.push('(' + or.join(' OR ') + ')');
    } else if (key === 'query' && props[key]) {
      conditions.push(`((LOWER(brand) LIKE $${(values.length + 1)}) OR (LOWER(name) LIKE $${(values.length + 1)}))`);
      values.push('%' + props[key].toLowerCase() + '%');
    } else if (key === 'sort' && props[key]) {
      switch (props[key]) {
        case 'price_asc': {
          sort = 'ORDER BY price ASC';
          break;
        }
        case 'price_desc': {
          sort = 'ORDER BY price DESC';
          break;
        }
        case 'name_asc': {
          sort = 'ORDER BY name_prefix ASC';
          break;
        }
        case 'name_desc': {
          sort = 'ORDER BY name_prefix DESC';
          break;
        }
        case 'rating_asc': {
          sort = 'ORDER BY rating ASC';
          break;
        }
        case 'rating_desc': {
          sort = 'ORDER BY rating DESC';
          break;
        }
        case 'reviews_asc': {
          sort = 'ORDER BY reviews_total ASC';
          break;
        }
        case 'reviews_desc': {
          sort = 'ORDER BY reviews_total DESC';
          break;
        }
        case 'sales_asc': {
          sort = 'ORDER BY sales_total ASC';
          break;
        }
        case 'sales_desc': {
          sort = 'ORDER BY sales_total DESC';
          break;
        }
        case 'popularity_asc': {
          sort = 'ORDER BY popularity ASC';
          break;
        }
        case 'popularity_desc': {
          sort = 'ORDER BY popularity DESC';
          break;
        }
        default: {
          sort = 'ORDER BY is_featured DESC NULLS LAST, id DESC';
          break;
        }
      }
    }
  });

  const sql = "SELECT id, name, brand, image, description, price, sale_price, on_sale, on_clearance, price_range, free_shipping, rating, reviews_total, categories, type FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + (sort ? " " + sort : "") + (props.size ? " LIMIT " + props.size : "") + (props.page && props.page > 1 ? " OFFSET " + ((props.page - 1) * props.size) : " OFFSET 0");
  //console.log(sql);

  const { rows } = await dbQuery<Hit>(sql, values);

  //await slow(5000);

  return {hits: rows};
}

//export const getStats = unstable_cache(async (props: any): Promise<Stat> => {
export async function getStats(props: SearchQueryProps): Promise<Stat> {
  'use cache';
  cacheLife('hours');

  //console.log('getStats', new Date().toLocaleTimeString());

  const conditions: string[] = [],
      values: string[] = [];

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ('${key}\\:' || $${(values.length + 1)})::tsquery)`);
        values.push(typeof item === 'string' ? item.replace(/\s/g,"\\ ").replace(/\&/g,"\\&") : item.toString());
      });
      conditions.push('(' + or.join(' OR ') + ')');
    } else if (key === 'query' && props[key]) {
      conditions.push(`((LOWER(brand) LIKE $${(values.length + 1)}) OR (LOWER(name) LIKE $${(values.length + 1)}))`);
      values.push('%' + props[key].toLowerCase() + '%');
    }
  });
  
  const sql = "SELECT COUNT(*) FROM (SELECT tsv FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + ") AS p";
  //console.log(sql);

  const { rows } = await dbQuery<Stat>(sql, values);
  const [row] = rows;

  //await slow(3000);

  return row;
}
/*
},
['stats'],
{ revalidate: 3600, tags: ['stats'] }
);
*/