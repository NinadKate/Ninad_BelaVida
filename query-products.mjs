import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT id, slug, name FROM product LIMIT 10`;
console.log(JSON.stringify(rows, null, 2));
