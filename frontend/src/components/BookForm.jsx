import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

function BookForm({ isEdit }) {
  const [form, setForm] = useState({ title: "", author: "", description: "", genre: "", year: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/books/${id}`).then((res) => setForm(res.data));
    }
  }, [isEdit, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await api.put(`/books/${id}`, form);
    } else {
      await api.post("/books", form);
    }
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {["title", "author", "description", "genre", "year"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field}
          value={form[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {isEdit ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}
export default BookForm;
