const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (isValid(username)) {
    res.status(400).json({ message: "Username already exists" });
  } else {
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book details" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by title" });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;