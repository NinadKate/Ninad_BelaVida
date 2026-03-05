// Script to fix product slugs that have spaces
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

function slugify(str) {
    return str.toLowerCase().trim()
        .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const rows = await sql`SELECT id, slug FROM product`;
let fixed = 0;
for (const row of rows) {
    const fixed_slug = slugify(row.slug);
    if (fixed_slug !== row.slug) {
        console.log(`Fixing: "${row.slug}" → "${fixed_slug}"`);
        await sql`UPDATE product SET slug = ${fixed_slug} WHERE id = ${row.id}`;
        fixed++;
    }
}
console.log(`Done! Fixed ${fixed} product slugs.`);
