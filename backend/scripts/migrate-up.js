const migrate = require('node-pg-migrate');

function runMigration() {
    require('dotenv').config({ path: ['.env.local', '.env'] });
    const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

    migrate.runner({
        databaseUrl: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
        dir: 'migrations',
        direction: 'up',
        migrationsTable: 'migration_information'
    });
}

runMigration();