const express = require('express');
const OMDBService = require('../services/omdb');
const { initDb, storeMovie } = require('../db');
const { initIndex, indexMovie, searchMovies } = require('../elasticSearch');

const router = express.Router();
const omdb = new OMDBService(process.env.OMDB_API_KEY);

router.get('/sync', async (req, res) => {
    try {
        await initDb();
        await initIndex();
        const movies = await omdb.fetchMoviesWithSpace(2020);
        await Promise.all(movies.map((movie) => storeMovie(movie)));
        await Promise.all(movies.map((movie) => indexMovie(movie)));
        res.json({ message: 'Movies synced successfully', count: movies.length });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/search', async (req, res) => {
    const { q, imdbID } = req.query;
    try {
        const results = await searchMovies(q, imdbID);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error.stack);
        res.status(500).json({ error: error.message || 'Unknown error during search' });
    }
});


module.exports = router;