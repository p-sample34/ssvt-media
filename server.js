import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Media from "./models/media.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Failed:", err));

// Upload media
app.post("/upload", async (req, res) => {
  try {
    const { url, type } = req.body;
    if (!url || !type) return res.status(400).json({ message: "Missing fields" });

    const media = new Media({ url, type });
    await media.save();
    res.status(201).json({ message: "Media uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all media
app.get("/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete media
app.delete("/media/:id", async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Serve viewer page as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "viewer.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
