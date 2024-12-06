//import { Pool, QueryResultRow } from 'pg';
import { neon } from '@neondatabase/serverless';

// Creates a global connection pool
/*
const pool = new Pool(process.env.DB_POSTGRES_URL ? {
  connectionString: process.env.DB_POSTGRES_URL,
  idleTimeoutMillis: 30000,
} : {
  host: process.env.DB_POSTGRES_HOST,
  user: process.env.DB_POSTGRES_USER,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  port: parseInt(process.env.DB_POSTGRES_PORT || '5432'),
  idleTimeoutMillis: 30000,
});
*/
const sql = neon(process.env.DB_POSTGRES_URL || '');

/*
export const dbQuery = <Result extends QueryResultRow>(
  text: string,
  params: any[] = []
) => {
  return pool.query<Result>(text, params)
}
  */
export const dbQuery = (
  text: string,
  params: any[] = []
) => {
  return sql(text, params)
}