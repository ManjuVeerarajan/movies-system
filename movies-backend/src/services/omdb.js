const axios = require('axios');

class OMDBService {
    constructor() {
        this.apiKey = '5192671b';
        this.baseUrl = 'http://www.omdbapi.com/';
    }

    async fetchMoviesWithSpace(year = 2020) {
        const movies = [];
        let page = 1;
        let totalResults = 0;

        do {
            const response = await axios.get(this.baseUrl, {
                params: {
                    apikey: this.apiKey,
                    s: 'space',
                    y: year,
                    type: 'movie',
                    page,
                },
            });
            if (response.data.Response === 'True') {
                movies.push(...response.data.Search);
                totalResults = parseInt(response.data.totalResults, 10);
                page++;
            } else {
                throw new Error(`OMDB API error: ${response.data.Error}`);
            }
        } while (movies.length < totalResults);

        // Fetch full details for each movie
        return Promise.all(
            movies.map((movie) =>
                axios.get(this.baseUrl, { params: { i: movie.imdbID, apikey: this.apiKey } })
                    .then((res) => res.data)
            )
        );
    }
}

module.exports = OMDBService;