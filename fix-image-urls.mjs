import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const OLD_PREFIX = 'https://b52f99c823eb070ac2b115f2021584aa.r2.cloudflarestorage.com/belavida-bucket';
const NEW_PREFIX = 'https://pub-cde9dc55882a4a6496a391b7acac8ef4.r2.dev';

const rows = await sql`SELECT id, images FROM product WHERE images IS NOT NULL`;
let fixed = 0;

for (const row of rows) {
    if (!row.images || row.images.length === 0) continue;

    let changed = false;
    const updated = row.images.map(url => {
        if (typeof url === 'string' && url.startsWith(OLD_PREFIX)) {
            changed = true;
            return url.replace(OLD_PREFIX, NEW_PREFIX);
        }
        return url;
    });

    if (changed) {
        // Pass each element individually using unnest/array syntax
        // Use a raw UPDATE with ARRAY[] literal
        const arrayLiteral = 'ARRAY[' + updated.map(u => `'${u.replace(/'/g, "''")}'`).join(',') + ']';
        await sql.query(`UPDATE product SET images = ${arrayLiteral} WHERE id = ${row.id}`);
        console.log(`Fixed product #${row.id}:`);
        updated.forEach((u, i) => console.log(`  [${i}] ${u}`));
        fixed++;
    }
}
console.log(`\nDone! Updated ${fixed} product(s).`);
