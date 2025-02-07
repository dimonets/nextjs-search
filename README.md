# Faceted Search Next.js/PostgreSQL Demo

This is a custom implementation of reactive and responsive Faceted Search made using Next.js 15 and PostgreSQL.

Live DEMO hosted on Vercel/Neon: [https://nextjs-search-iota.vercel.app](https://nextjs-search-iota.vercel.app)

## Prerequisites

Apps needed to run this application locally:
- Node.js 20+
- PostgreSQL 17+
- PNPM *(recommended over NPM)*

Services recommended to run this application remotely:
- Vercel
- Neon or Supabase

## Getting Started Locally

1) Clone this repository
   
2) Install required dependencies:
`pnpm install`

3) Create new database in PostgreSQL
  
4) Import the products dump to new database from:
`~/data/products.json`

5) Copy `~/.env.sample` to `~/.env` and update the database connection parameters there

6) Run the development server:
`pnpm run dev`

7) Open [http://localhost:3000](http://localhost:3000) with your browser to see the working application.
