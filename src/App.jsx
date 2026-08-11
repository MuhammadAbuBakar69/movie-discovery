import React, { useState, useEffect } from "react";
import "./movie-discovery_App.css";

// TMDB API Key placeholder
const API_KEY = "DEMO"; // Replace with your TMDB API key
const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Fallback demo movies if API key is invalid or rate limited
const MOCK_MOVIES = [
  {
    id: 1,
    title: "Inception",
    poster_path: "/oYuLE39z9Q1B32M19321.jpg",
    backdrop_path: "/s3TBrRGB132.jpg",
    vote_average: 8.8,
    release_date: "2010-07-16",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  {
    id: 2,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCY6.jpg",
    backdrop_path: "/xJH123.jpg",
    vote_average: 8.6,
    release_date: "2014-11-07",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WM.jpg",
    vote_average: 9.0,
    release_date: "2008-07-18",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    id: 4,
    title: "Cyberpunk Horizon",
    poster_path: null,
    vote_average: 7.9,
    release_date: "2024-03-15",
    overview: "In a neon-lit futuristic metropolis, a rogue hacker uncover a dangerous conspiracy deep within the city grid."
  }
];

export default function App() {
  const [userApiKey, setUserApiKey] = useState(API_KEY);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("tmdb_watchlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState("discover"); // "discover" | "watchlist"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    localStorage.setItem("tmdb_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setError("");
    const keyToUse = userApiKey.trim() || API_KEY;
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?api_key=${keyToUse}&query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?api_key=${keyToUse}&sort_by=popularity.desc`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`API Request failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.warn("API fetch error, falling back to mock data:", err.message);
      setError("Note: Using demo dataset (add a valid TMDB API key to search live API).");
      if (query) {
        setMovies(MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query.toLowerCase())));
      } else {
        setMovies(MOCK_MOVIES);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(searchQuery);
  };

  const toggleWatchlist = (movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
    }
  };

  const isInWatchlist = (id) => watchlist.some(m => m.id === id);

  const displayedMovies = view === "watchlist" ? watchlist : movies;

  return (
    <div className="movie-app">
      <header className="app-header">
        <div className="header-brand">
          <span className="logo-icon">🎬</span>
          <h1>CinePulse</h1>
        </div>
        <div className="api-key-input-container">
          <label htmlFor="api-key-input">API Key:</label>
          <input
            id="api-key-input"
            type="password"
            placeholder="TMDB API Key"
            value={userApiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            className="api-key-input"
          />
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-tabs">
          <button
            className={`tab-btn ${view === "discover" ? "active" : ""}`}
            onClick={() => setView("discover")}
          >
            🔥 Discover
          </button>
          <button
            className={`tab-btn ${view === "watchlist" ? "active" : ""}`}
            onClick={() => setView("watchlist")}
          >
            🔖 Watchlist ({watchlist.length})
          </button>
        </div>

        {view === "discover" && (
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        )}
      </nav>

      {error && <div className="notice-banner">{error}</div>}

      <main className="movie-content">
        {loading ? (
          <div className="loading-spinner">Loading movies...</div>
        ) : displayedMovies.length === 0 ? (
          <div className="empty-state">
            <p>{view === "watchlist" ? "Your watchlist is empty! Add some movies." : "No movies found."}</p>
          </div>
        ) : (
          <div className="movie-grid">
            {displayedMovies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster";
              const inWatchlist = isInWatchlist(movie.id);

              return (
                <div className="movie-card" key={movie.id}>
                  <div className="poster-wrapper" onClick={() => setSelectedMovie(movie)}>
                    <img src={posterUrl} alt={movie.title} loading="lazy" />
                    <div className="rating-badge">
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 title={movie.title}>{movie.title}</h3>
                    <p className="release-year">
                      {movie.release_date ? movie.release_date.split("-")[0] : "Unknown"}
                    </p>
                    <button
                      className={`watchlist-btn ${inWatchlist ? "remove" : "add"}`}
                      onClick={() => toggleWatchlist(movie)}
                    >
                      {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Selected Movie Modal */}
      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMovie(null)}>✕</button>
            <div className="modal-body">
              <img
                src={selectedMovie.poster_path ? `${IMAGE_BASE_URL}${selectedMovie.poster_path}` : "https://via.placeholder.com/300x450"}
                alt={selectedMovie.title}
                className="modal-poster"
              />
              <div className="modal-details">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <span>⭐ {selectedMovie.vote_average} / 10</span>
                  <span>📅 {selectedMovie.release_date}</span>
                </div>
                <p className="modal-overview">{selectedMovie.overview || "No description available."}</p>
                <button
                  className={`watchlist-btn ${isInWatchlist(selectedMovie.id) ? "remove" : "add"}`}
                  onClick={() => toggleWatchlist(selectedMovie)}
                >
                  {isInWatchlist(selectedMovie.id) ? "Remove from Watchlist" : "Add to Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
