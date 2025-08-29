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
    <div className="relative min-h-screen bg-peach p-6 font-sans overflow-hidden flex flex-col items-center">
      {/* Floating Book Emojis */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-3xl animate-bounce-slow"
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

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-brown mb-6 flex items-center gap-3 z-10">
        <span>📚</span>
        <span>Book Finder</span>
        <span>📖</span>
      </h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8 w-full max-w-md z-10">
        <input
          type="text"
          placeholder="Search by book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-5 py-3 rounded-full border border-brown w-full focus:ring-2 focus:ring-brown focus:outline-none shadow-md transition"
        />
        <button
          onClick={searchBooks}
          className="px-6 py-3 bg-brown text-peach rounded-full hover:bg-dark-brown shadow-lg transition transform hover:-translate-y-1 mt-2 sm:mt-0"
        >
          Search
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-center text-brown mb-4 z-10">Loading...</p>}
      {error && <p className="text-center text-red-600 mb-4 z-10">{error}</p>}

      {/* Book Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-10 w-full max-w-6xl">
        {books.map((book, idx) => (
          <div
            key={idx}
            className="bg-peach p-4 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:scale-105 hover:shadow-brown/50 ring-1 ring-brown"
          >
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              className="w-full h-64 object-cover rounded-md mb-4 transition-transform transform hover:rotate-3 hover:scale-110"
            />
            <h2 className="font-semibold text-lg mb-1 text-brown">{book.title}</h2>
            <p className="text-sm text-brown mb-1">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="text-xs text-brown">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Book Animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </div>
  );
}
