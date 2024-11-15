// src/MovieModal.js
import React from 'react';

function MovieModal({ movie, onClose }) {
  if (!movie) return null; // If no movie is selected, don't show the modal

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{movie.Title} ({movie.Year})</h2>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Runtime:</strong> {movie.Runtime}</p>
        <p><strong>Language:</strong> {movie.Language}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default MovieModal;
