const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.get("/api/test", protect, (req, res) => {
  res.json({ message: "You are authorized!", userId: req.user.id });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
