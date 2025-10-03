import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error("Error fetching book:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to load book");
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/books/${id}`); // token attached via interceptor
      navigate("/"); // redirect to home after delete
    } catch (error) {
      console.error("Error deleting book:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete book");
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.year}</p>
      <p className="mt-2">{book.description}</p>
      <p className="mt-2 text-gray-600">Added by: {book.addedBy?.name}</p>

      {/* Only show Edit/Delete if logged-in user is the creator */}
      {user && user._id === book.addedBy?._id && (
        <div className="mt-4 space-x-2">
          <Link
            to={`/edit/${book._id}`}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default BookDetails;
