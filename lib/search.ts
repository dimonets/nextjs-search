import 'server-only';

import { dbQuery } from '@/db/index';
import { unstable_cacheLife as cacheLife } from 'next/cache';
//import { unstable_cache } from 'next/cache';
import { slow } from '@/utils/slow';

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

export async function getFacets(props: SearchQueryProps): Promise<{ facets: Facet[] }> {
  //'use cache';
  //cacheLife('hours');

  /*
  const conditions: string[] = [],
      values: string[] = [];

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        if (key === 'categories') {
          item = '["' + item.toString() + '"]';
          or.push(`(${key} @> $${(values.length + 1)})`)
        } else {
          or.push(`(${key} ${key === 'brand' || key === 'type' ? 'LIKE' : '='} $${(values.length + 1)})`);
        }
        values.push(item.toString());
      });
      conditions.push('(' + or.join(' OR ') + ')');
    } else if (key === 'query' && props[key]) {
      conditions.push(`((LOWER(brand) LIKE $${(values.length + 1)}) OR (LOWER(name) LIKE $${(values.length + 1)}))`);
      values.push('%' + props[key].toLowerCase() + '%');
    }
  });

  const sql = "SELECT 'categories' AS attribute, REPLACE(CAST(jsonb_array_elements(categories) AS CHARACTER VARYING(99999)), '\"', '') AS value, COUNT(id) AS count FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + " GROUP BY jsonb_array_elements(categories) UNION SELECT 'brand' AS attribute, brand AS value, COUNT(id) AS count FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + " GROUP BY brand UNION SELECT 'type' AS attribute, type AS value, COUNT(id) AS count FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + " GROUP BY type UNION SELECT 'price_range' AS attribute, price_range AS value, COUNT(id) AS count FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + " GROUP BY price_range UNION SELECT 'rating' AS attribute, CAST(rating AS CHARACTER VARYING(99999)) AS value, COUNT(id) AS count FROM products" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "") + " GROUP BY rating ORDER BY count DESC";
  */

  const conditions: string[] = [],
      conditions2: string[] = [],
      conditions3: string[] = [],
      conditions4: string[] = [],
      values: string[] = [];

  // If we have less than 2 different facets selected then use more complex logic with multiple values in next queries
  const useComplexFacets = !(Object.values(props).filter((value) => Array.isArray(value) && value.length > 0).length > 2);

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      const or2: string[] = [];
      const and: string[] = [];
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ''${key}\\:' || $${(values.length + 1)}::text || '''::tsquery)`);
        values.push(typeof item === 'string' ? item.replace(/\s/g,"\\ ").replace(/\&/g,"\\&") : item.toString());
        if (useComplexFacets && !props['query']) {
          or2.push(`split_part(word, ':', 2) = $${(values.length + 1)}::text`);
          and.push(`split_part(word, ':', 2) <> $${(values.length + 1)}::text`);
          values.push(typeof item === 'string' ? item : item.toString());
        }
      });
      conditions.push('(' + or.join(' OR ') + ')');
      if (useComplexFacets && !props['query']) {
        conditions2.push(`(split_part(word, ':', 1) = '${key}'` + " AND (" + or2.join(' OR ') + '))');
        conditions3.push(`(split_part(word, ':', 1) <> '${key}')`);
        conditions4.push(`(split_part(word, ':', 1) = '${key}'` + " AND " + and.join(' AND ') + ')');
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

  const { rows } = await dbQuery<Facet>(sql, values);

  //await slow(5000);

  return { facets: rows };
}

export async function getResults(props: SearchProps): Promise<{ hits: Hit[] }> {
  //'use cache';
  //cacheLife('hours');

  const conditions: string[] = [],
      values: string[] = [];

  let sort: string = 'ORDER BY is_featured DESC NULLS LAST, id DESC';

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      /*
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        if (key === 'categories') {
          item = '["' + item.toString() + '"]';
          or.push(`(${key} @> $${(values.length + 1)})`)
        } else {
          or.push(`(${key} ${key === 'brand' || key === 'type' ? 'LIKE' : '='} $${(values.length + 1)})`);
        }
        values.push(item.toString());
      });
      */
      (props[key as keyof SearchProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ('${key}\\:' || $${(values.length + 1)}::text)::tsquery)`);
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

  const { rows } = await dbQuery<Hit>(sql, values);

  //await slow(10000);

  return { hits: rows };
}

export async function getStats(props: SearchQueryProps): Promise<Stat> {
  //'use cache';
  //cacheLife('hours');

  const conditions: string[] = [],
  values: string[] = [];

  Object.keys(props).map((key: string) => {
    if (Array.isArray(props[key as keyof SearchQueryProps])) {
      const or: string[] = [];
      /*
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        if (key === 'categories') {
          item = '["' + item.toString() + '"]';
          or.push(`(${key} @> $${(values.length + 1)})`)
        } else {
          or.push(`(${key} ${key === 'brand' || key === 'type' ? 'LIKE' : '='} $${(values.length + 1)})`);
        }
        values.push(item.toString());
      });
      */
      (props[key as keyof SearchQueryProps] as string[]).map((item: string | number) => {
        or.push(`(tsv @@ ('${key}\\:' || $${(values.length + 1)}::text)::tsquery)`);
        values.push(typeof item === 'string' ? item.replace(/\s/g,"\\ ").replace(/\&/g,"\\&") : item.toString());
      });
      conditions.push('(' + or.join(' OR ') + ')');
    } else if (key === 'query' && props[key]) {
      conditions.push(`((LOWER(brand) LIKE $${(values.length + 1)}) OR (LOWER(name) LIKE $${(values.length + 1)}))`);
      values.push('%' + props[key].toLowerCase() + '%');
    }
  });

  const sql = "SELECT COUNT(*) FROM products AS p" + (conditions.length > 0 ? " WHERE " + conditions.join(' AND ') : "");

  const { rows } = await dbQuery<Stat>(sql, values);
  const [row] = rows;

  //await slow(3000);

  return row;
}