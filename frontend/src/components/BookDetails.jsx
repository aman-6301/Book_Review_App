import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import StarRating from "../components/StarRating";
import RatingChart from "../components/RatingChart"; // ✅ Import chart

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookAndReviews = async () => {
    try {
      const resBook = await api.get(`/books/${id}`);
      setBook(resBook.data);

      const resReviews = await api.get(`/reviews/book/${id}`);
      setReviews(resReviews.data.reviews);
      setAverageRating(resReviews.data.averageRating);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBookAndReviews();
  }, [id]);

  const handleDeleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    await api.delete(`/books/${id}`);
    navigate("/");
  };

  const handleAddReview = (newReview) => {
    setReviews([...reviews, newReview]);
    const newAvg =
      (parseFloat(averageRating) * reviews.length + newReview.rating) /
      (reviews.length + 1);
    setAverageRating(newAvg.toFixed(2));
  };

  const handleUpdateReview = (updatedReview) => {
    const updatedReviews = reviews.map((r) =>
      r._id === updatedReview._id ? updatedReview : r
    );
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
      updatedReviews.length;
    setAverageRating(newAvg.toFixed(2));
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter((r) => r._id !== reviewId);
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.length > 0
        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length
        : 0;
    setAverageRating(newAvg.toFixed(2));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Book Info */}
      <h2 className="text-2xl font-bold">{book.title}</h2>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Genre:</strong> {book.genre}
      </p>
      <p>
        <strong>Year:</strong> {book.year}
      </p>
      <p className="mt-2">{book.description}</p>
      <p className="mt-2 text-gray-600">Added by: {book.addedBy?.name}</p>
      {user && user._id === book.addedBy?._id && (
        <div className="mt-4 space-x-2">
          <Link
            to={`/edit/${book._id}`}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDeleteBook}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* Rating Chart ✅ */}
      <RatingChart bookId={book._id} />

      {/* Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">
          Reviews ({reviews.length}) - Average:{" "}
          <StarRating rating={Math.round(averageRating)} />
        </h3>

        {user && (
          <ReviewForm bookId={book._id} currentUser={user} onAdd={handleAddReview} />
        )}

        {reviews.map((r) => (
          <ReviewItem
            key={r._id}
            review={r}
            currentUser={user}
            onUpdate={handleUpdateReview}
            onDelete={handleDeleteReview}
          />
        ))}
      </div>
    </div>
  );
}

export default BookDetails;
