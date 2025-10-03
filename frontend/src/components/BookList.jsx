import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Get paginated books
        const res = await api.get(`/books?page=${page}`);
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

    fetchBooks();
  }, [page]);

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
