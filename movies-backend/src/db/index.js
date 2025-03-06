const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'movies_db',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
});

const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS movies (
            imdb_id VARCHAR(20) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            director VARCHAR(255),
            plot TEXT,
            poster VARCHAR(255),
            year INTEGER
            );
    `);
};

const storeMovie = async ({ imdbID, Title, Director, Plot, Poster, Year }) => {
    await pool.query(
        `INSERT INTO movies (imdb_id, title, director, plot, poster, year)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (imdb_id) DO
        UPDATE SET
            title = EXCLUDED.title,
            director = EXCLUDED.director,
            plot = EXCLUDED.plot,
            poster = EXCLUDED.poster,
            year = EXCLUDED.year`,
        [imdbID, Title, Director, Plot, Poster, Year]
    );
};

module.exports = { pool, initDb, storeMovie };