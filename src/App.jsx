import { useState } from "react";

function App() {
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
      if (data.docs.length === 0) {
        setError("No results found.");
      } else {
        setBooks(data.docs.slice(0, 12));
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-indigo-50 p-8 font-sans overflow-hidden">
      {/* Floating Book Emojis */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-bounce-slow"
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
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-indigo-700 flex justify-center items-center gap-3 relative z-10">
        <span>📚</span>
        <span>Book Finder</span>
        <span>📖</span>
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center gap-3 mb-8 relative z-10">
        <input
          type="text"
          placeholder="Search by book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-5 py-3 rounded-full border border-gray-300 w-80 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-md transition"
        />
        <button
          onClick={searchBooks}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg transition transform hover:-translate-y-1"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-500 mb-4 relative z-10">Loading...</p>}

      {/* Error */}
      {error && <p className="text-center text-red-500 mb-4 relative z-10">{error}</p>}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
        {books.map((book, idx) => (
          <div
            key={idx}
            className="bg-gray-50 p-4 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:scale-105 hover:shadow-indigo-400/50 hover:rotate-1 ring-1 ring-gray-200"
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
            <h2 className="font-semibold text-lg mb-1">{book.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* Tailwind Animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
