import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Import theme context

function Navbar() {
  const { token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // ✅ Access theme state
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Book App</Link>

      <div className="flex gap-4 items-center">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-sm"
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {token ? (
          <>
            <Link to="/add" className="hover:underline">Add Book</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
