import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewForm({ bookId, currentUser, onAdd }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return alert("You must be logged in to add a review");

    // Debug: check values before sending
    console.log("Submitting review:", { bookId, rating, reviewText: text });

    try {
      const res = await api.post(`/reviews/${bookId}`, {
        rating: Number(rating),  // ensure number type
        reviewText: text,
      });

      // Add populated user data
      const newReview = { ...res.data, user: currentUser };

      // Update parent state
      onAdd(newReview);

      // Reset form
      setRating(5);
      setText("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <StarRating rating={rating} editable={true} onChange={setRating} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Add Review
      </button>
    </form>
  );
}

export default ReviewForm;
