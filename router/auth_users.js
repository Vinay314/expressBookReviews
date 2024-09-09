const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid (e.g., exists in the users array)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate user by username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
    req.session.token = token;
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add/modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review for the book
  if (!books[isbn].reviews[req.user.username]) {
    books[isbn].reviews[req.user.username] = review;
    return res.status(201).json({ message: "Review added" });
  } else {
    books[isbn].reviews[req.user.username] = review;
    return res.status(200).json({ message: "Review updated" });
  }
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists for the user
  if (!books[isbn].reviews[req.user.username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete books[isbn].reviews[req.user.username];
  res.status(200).json({ message: "Review deleted" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;