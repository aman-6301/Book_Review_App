import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Search, filter, sort states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState(""); // only "year" for now

  const fetchBooks = async () => {
    try {
      // Build query params
      let query = `/books?page=${page}`;
      if (search) query += `&search=${search}`;
      if (genre) query += `&genre=${genre}`;
      if (sort) query += `&sort=${sort}`;

      // Get paginated books
      const res = await api.get(query);
      const booksData = res.data.books;

      // Fetch average rating for each book
      const booksWithRating = await Promise.all(
        booksData.map(async (book) => {
          try {
            const ratingRes = await api.get(`/reviews/book/${book._id}`);
            return { ...book, averageRating: parseFloat(ratingRes.data.averageRating) };
          } catch {
            return { ...book, averageRating: 0 };
          }
        })
      );

      setBooks(booksWithRating);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search, genre, sort]);

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <span className="text-yellow-500">
        {"★".repeat(rounded) + "☆".repeat(5 - rounded)}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Books</h2>

      {/* Search, Filter & Sort UI */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          {/* Add more genres if needed */}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="year">Published Year</option>
        </select>
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-1 gap-4">
        {books.map((book) => (
          <Link
            key={book._id}
            to={`/book/${book._id}`}
            className="p-4 border rounded shadow hover:bg-gray-100"
          >
            <h3 className="font-semibold">{book.title}</h3>
            <p>{book.author}</p>
            <div className="flex items-center space-x-2">
              {renderStars(book.averageRating)}
              <span className="text-gray-600">{book.averageRating.toFixed(1)}/5</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${
              page === i + 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookList;
