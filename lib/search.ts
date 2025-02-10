import 'server-only';

import { dbQuery } from '@/db/index';
import { unstable_cacheLife as cacheLife } from 'next/cache';
//import { unstable_cache } from 'next/cache';
import { slow } from '@/utils/slow';

export interface SearchProps {
  page: number,
  size: number
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

export async function getResults(props: SearchProps): Promise<{ hits: Hit[] }> {
  //'use cache';
  //cacheLife('hours');

  const sql = "SELECT id, name, brand, image, description, price, sale_price, on_sale, on_clearance, price_range, free_shipping, rating, reviews_total, categories, type FROM products ORDER BY is_featured DESC NULLS LAST, id DESC" + (props.size ? " LIMIT " + props.size : "") + (props.page && props.page > 1 ? " OFFSET " + ((props.page - 1) * props.size) : " OFFSET 0");
  const { rows } = await dbQuery<Hit>(sql);

  //await slow(10000);

  return { hits: rows };
}

export async function getStats(): Promise<Stat> {
  //'use cache';
  //cacheLife('hours');
  
  const sql = "SELECT COUNT(*) FROM products AS p";

  const { rows } = await dbQuery<Stat>(sql);
  const [row] = rows;

  //await slow(3000);

  return row;
}