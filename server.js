require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const booksRouter = require("./routes/books");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Library Book Management API",
    endpoints: {
      listBooks: "GET /api/books?page=1&limit=10",
      addBook: "POST /api/books",
      updateAvailability: "PATCH /api/books/:id"
    }
  });
});

app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

async function startServer() {
  if (!mongoUri) {
    console.error("MONGODB_URI is missing. Add it to your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    app.listen(port, () => {
      console.log(`Library API is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
