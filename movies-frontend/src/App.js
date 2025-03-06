import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [imdbID, setImdbID] = useState(''); // New state for imdbID
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [error, setError] = useState('');

  const sync = async () => {
    setLoading(true);
    setError('');
    setSyncStatus('');
    try {
      const res = await fetch('http://localhost:3000/movies/sync', { method: 'GET' });
      if (!res.ok) throw new Error(`Sync failed: ${res.statusText}`);
      const data = await res.json();
      setSyncStatus(`Synced ${data.count} movies successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const url = imdbID
          ? `http://localhost:3000/movies/search?imdbID=${imdbID}`
          : query.trim()
              ? `http://localhost:3000/movies/search?q=${query}`
              : 'http://localhost:3000/movies/search';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Movies Search</h1>

        <div style={{ marginBottom: '20px' }}>
          <button onClick={sync} disabled={loading}>
            {loading ? 'Syncing...' : 'Sync Movies from OMDB'}
          </button>
          {syncStatus && <p style={{ color: 'green' }}>{syncStatus}</p>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, director, or plot..."
              style={{ padding: '5px', width: '200px', marginRight: '10px' }}
          />
          <input
              value={imdbID}
              onChange={(e) => setImdbID(e.target.value)}
              placeholder="Search by IMDb ID (e.g., tt1234567)"
              style={{ padding: '5px', width: '200px', marginRight: '10px' }}
          />
          <button onClick={search} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          {loading && <p>Loading...</p>}
          {!loading && movies.length === 0 && !error && (query || imdbID) && (
              <p>No movies found for "{query || imdbID}".</p>
          )}
          {movies.map((movie) => (
              <div
                  key={movie.imdb_id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    maxWidth: '500px',
                  }}
              >
                <img
                    src={movie.poster}
                    alt={movie.title}
                    width="100"
                    style={{ float: 'left', marginRight: '10px' }}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
                />
                <h2 style={{ margin: '0 0 5px' }}>{movie.title}</h2>
                <p style={{ margin: '0 0 5px' }}>
                  <strong>Director:</strong> {movie.director || 'N/A'}
                </p>
                <p style={{ margin: '0' }}>{movie.plot || 'No plot available'}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;