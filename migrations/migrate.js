import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';

const migrationsDir = path.join(process.cwd(), 'migrations');

const runMigrations = async () => {
    const client = await pool.connect();
    try {
        console.log('Checking for new migrations...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations_log (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));

        for (const file of files) {
            const res = await client.query('SELECT filename FROM migrations_log WHERE filename = $1', [file]);

            if (res.rows.length === 0) 
            {
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf-8');

                console.log(`Running migration: ${file}`);
                await client.query(sql);

                await client.query('INSERT INTO migrations_log (filename) VALUES ($1)', [file]);

                console.log(`Migration ${file} applied successfully.`);
            } 
            else 
            {
                console.log(`Skipping already applied migration: ${file}`);
            }
        }

        console.log('All pending migrations applied.');
    } 
    catch (error) {
        console.error('Migration error:', error.message);
    } 
    finally {
        client.release();
        pool.end();
    }
};

runMigrations();
