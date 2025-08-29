import { useState } from "react";
import "./index.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setBooks([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.docs.length === 0) setError("No results found.");
      else setBooks(data.docs.slice(0, 12));
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Floating book emojis */}
      <div className="floating-emojis">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="emoji"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            📚
          </span>
        ))}
      </div>

      {/* Header */}
      <h1 className="title">
        <span role="img" aria-label="book">📚</span> Book Finder <span role="img" aria-label="book">📖</span>
      </h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="status-message error">{error}</p>}

      {/* Book Results */}
      <div className="books-grid">
        {books.map((book, idx) => (
          <div key={idx} className="book-card">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
            />
            <h2 className="book-title">{book.title}</h2>
            <p className="book-author">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="book-year">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
