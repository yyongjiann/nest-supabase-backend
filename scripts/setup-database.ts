import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false, // Necessary for Supabase connections
	},
});

async function setupDatabase() {
	try {
		await client.connect();
		console.log('Connected to the database.');
		// Grant permissions on the table to service role
		await client.query(`
            GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
            GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.sheltered_routes TO service_role;
    `);
		console.log('Permissions granted to the service role.');

		// Grant permissions on the table to authenticated role
		await client.query(`
            GRANT USAGE ON SCHEMA public TO authenticated;
            GRANT SELECT ON TABLE public.sheltered_routes TO authenticated;
            GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
    `);
		console.log('Permissions granted to the authenticated role.');

		// Enable PostGIS extension
		await client.query(`
            CREATE EXTENSION IF NOT EXISTS postgis;
    `);
		console.log('PostGIS extension enabled.');

		// Create the table for storing GeoJSON data
		await client.query(`
            CREATE TABLE IF NOT EXISTS sheltered_routes (
            id SERIAL PRIMARY KEY,
            object_id INTEGER,
            route GEOMETRY(GEOMETRY, 4326),
            created_at TIMESTAMP DEFAULT NOW()
      );
    `);
		console.log('Table "sheltered_routes" created or already exists.');

		//Create spatial index on the route column
		await client.query(`
            CREATE INDEX idx_sheltered_routes_geom ON public.sheltered_routes USING GIST (route);
        `);
		console.log('Index "idx_sheltered_routes_geom" created.');
	} catch (error) {
		console.error('Error setting up the database:', error);
	} finally {
		await client.end();
		console.log('Database connection closed.');
	}
}

// Run the setup function
setupDatabase().catch((error) => console.error('Setup script failed:', error));
