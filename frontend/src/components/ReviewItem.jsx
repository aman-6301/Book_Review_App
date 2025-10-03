import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewItem({ review, currentUser, onUpdate, onDelete }) {
  const isOwner = currentUser?._id === review.userId;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.reviewText);
  const [rating, setRating] = useState(review.rating);

  const handleSave = async () => {
    try {
      const res = await api.put(`/reviews/${review._id}`, { rating, reviewText: text });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update review");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${review._id}`);
      onDelete(review._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div className="border p-3 rounded mb-2">
      <div className="flex justify-between items-center mb-1">
        <strong>{review.user?.name || "User"}</strong>
        <StarRating rating={rating} editable={editing} onChange={setRating} />
      </div>

      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      ) : (
        <p>{text}</p>
      )}

      {isOwner && (
        <div className="mt-2 flex gap-2 text-sm">
          {editing ? (
            <>
              <button onClick={handleSave} className="text-green-500 underline">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="text-gray-500 underline">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="text-blue-500 underline">
                Edit
              </button>
              <button onClick={handleDelete} className="text-red-500 underline">
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
