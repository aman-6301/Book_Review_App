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
    api.get(`/books/${id}`).then((res) => setBook(res.data));
  }, [id]);

  const handleDelete = async () => {
    await api.delete(`/books/${id}`);
    navigate("/");
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.year}</p>
      <p>{book.description}</p>
      <p className="mt-2 text-gray-600">Added by: {book.addedBy?.name}</p>

      {user && user._id === book.addedBy?._id && (
        <div className="mt-4 space-x-2">
          <Link to={`/edit/${book._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</Link>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      )}
    </div>
  );
}
export default BookDetails;
