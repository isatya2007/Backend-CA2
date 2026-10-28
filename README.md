# Library Book Management API

A small Express API for creating books, listing them with pagination, and changing their availability.

## Run it

1. Install Node.js and start MongoDB locally, or create a MongoDB Atlas database.
2. Open this folder in a terminal and run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your database connection string.
4. Run `npm run dev` (or `npm start`). The API uses port 3000 by default.

## Endpoints

### Add a book

`POST /api/books`

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "category": "Fantasy"
}
```

Title is required. New books start with `available: true` and receive a `createdAt` date.

### Get books

`GET /api/books?page=1&limit=10`

The response includes `page`, `limit`, `total`, and `books`.

### Update availability

`PATCH /api/books/:id`

```json
{
  "available": false
}
```

Use the `_id` returned when the book was created or listed.
