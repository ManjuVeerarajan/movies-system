const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ES_HOST || 'http://localhost:9200' });

const initIndex = async () => {
    await client.indices.create(
        {
            index: 'movies',
            body: {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        director: { type: 'text' },
                        plot: { type: 'text' },
                        poster: { type: 'keyword' },
                        imdb_id: { type: 'keyword' },
                    },
                },
            },
        },
        { ignore: [400] }
    );
};

const indexMovie = async (movie) => {
    try {
        await client.index({
            index: 'movies',
            id: movie.imdbID,
            body: {
                imdb_id: movie.imdbID,
                title: movie.Title,
                director: movie.Director,
                plot: movie.Plot,
                poster: movie.Poster,
            },
        });
    } catch (error) {
        console.error(`Failed to index movie ${movie.imdbID}:`, error);
        throw error;
    }
};

const searchMovies = async (query, imdbID) => {
    try {
        let searchBodies;
        if (imdbID) {
            searchBodies = {
                query: {
                    term: {
                        imdb_id: imdbID, // Exact match on imdb_id
                    },
                },
            };
        } else {
            searchBodies = query
                ? {
                    query: {
                        multi_match: {
                            query,
                            fields: ['title', 'director', 'plot'],
                        },
                    },
                }
                : {
                    query: {
                        match_all: {},
                    },
                };
        }

        const result = await client.search({
            index: 'movies',
            body: searchBodies,
            size: 150,
        });
        return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
};


module.exports = { initIndex, indexMovie, searchMovies };