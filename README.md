# Movie Discovery Starter (Vite + React)

A dark, cinematic movie discovery web application powered by the TMDB (The Movie Database) API.

## Features
- **Discover Trending Movies**: Fetch popular titles directly from TMDB.
- **Real-time Search**: Search for movies by title.
- **Watchlist Persistence**: Add/remove movies to your personal watchlist saved in `localStorage`.
- **Movie Details Modal**: View overview, ratings, and release details.
- **Fallback Demo Mode**: Pre-loaded with mock movie data if no API key is provided or API calls are rate-limited.

## TMDB API Setup Instructions
1. Register for a free account at [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Navigate to your Account Settings -> API.
3. Request an API key (Developer key).
4. Enter your API key directly into the input field at the top right of the application header, or update the `API_KEY` constant in `movie-discovery_App.jsx`.

## Project Structure
- `movie-discovery_App.jsx`: Main React component handling TMDB API queries, state, and UI.
- `movie-discovery_App.css`: Cinematic dark theme stylesheet.

## How to Run in Vite React App
1. Place `movie-discovery_App.jsx` and `movie-discovery_App.css` into your Vite project's `src` folder.
2. Import `movie-discovery_App.jsx` into `main.jsx` or `App.jsx`.
3. Run `npm run dev`.
