const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn]
  if(book) return res.status(200).json(book);
  else return res.status(400).json({message: `ISBN ${req.params.isbn} does not exist`})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const keys = Object.keys(books)
  const bookKey = keys.find(k => books[k].author === req.params.author)
  if(bookKey) return res.status(200).json(books[bookKey])
  else return res.status(400).json({message: `No books found by ${req.params.author}!`})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const keys = Object.keys(books)
  const bookKey = keys.find(k => books[k].title === req.params.title)
  if(bookKey) return res.status(200).json(books[bookKey])
  else return res.status(400).json({message: `No books found titled ${req.params.title}!`})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn]
  if(book) return res.status(200).json(book.reviews);
  else return res.status(400).json({message: `ISBN ${req.params.isbn} does not exist. No review could be returned`})
});

module.exports.general = public_users;
