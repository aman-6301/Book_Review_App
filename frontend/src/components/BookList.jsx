import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await api.get(`/books?page=${page}`);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    };
    fetchBooks();
  }, [page]);

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
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
export default BookList;
