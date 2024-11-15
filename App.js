import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './searchBar';
import MovieList from './movieList';
import MovieModal from './movieModal';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Correctly define the API_KEY as a string
  const API_KEY = 'e1c9d0a';  // Use a string for the API key

  // Memoize fetchMovies function to avoid unnecessary re-creations on re-renders
  const fetchMovies = useCallback(async (query) => {
    if (!query.trim()) {
      setError('Please enter a valid movie name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://www.omdbapi.com/', {  // Use https://
        params: {
          s: query,   // Movie search query
          apikey: API_KEY,   // API key from environment variables
        },
      });

      if (response.data.Response === 'True') {
        setMovies(response.data.Search || []);
      } else {
        setMovies([]);
        setError(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);  // Add API_KEY to dependency array if it's dynamic

  // Memoize fetchPopularMovies to ensure the function reference stays the same
  const fetchPopularMovies = useCallback(async () => {
    // "popular" doesn't work with OMDB API directly, so use a popular term instead.
    fetchMovies('star wars'); // Example query to fetch popular movies
  }, [fetchMovies]);  // Dependency is fetchMovies

  useEffect(() => {
    fetchPopularMovies();
  }, [fetchPopularMovies]);  // Add fetchPopularMovies to dependencies

  // Fetch detailed information about the selected movie
  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          i: imdbID,
          apikey: API_KEY,
        },
      });

      if (response.data.Response === 'True') {
        setSelectedMovie(response.data); // Set detailed movie info
      } else {
        setSelectedMovie(null);
        setError(response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Error fetching movie details. Please try again later.');
    }
  };

  const handleMovieClick = (movie) => {
    fetchMovieDetails(movie.imdbID);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="App">
      <h1>Movie Search</h1>
      <SearchBar onSearch={fetchMovies} />
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      <MovieList movies={movies} onMovieClick={handleMovieClick} />
      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
