const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// TASK 10 - Use Promises
public_users.get('/async-get-books', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.status(200).json(books));
  });

  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const book = books[req.params.isbn]
  if (book) return res.status(200).json(book);
  else return res.status(400).json({ message: `ISBN ${req.params.isbn} does not exist` })
});
// TASK 11 - Use Promises
public_users.get('/async-get-books/isbn/:isbn', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const book = books[req.params.isbn]
    if (book) resolve(res.status(200).json(book));
    else reject({ message: `ISBN ${req.params.isbn} does not exist` })
  });

  return get_books.then(() => console.log("Promise for Task 11 resolved"))
  .catch(error => res.status(400).json(error))
});
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const keys = Object.keys(books)
  const bookKey = keys.find(k => books[k].author === req.params.author)
  if (bookKey) return res.status(200).json(books[bookKey])
  else return res.status(400).json({ message: `No books found by ${req.params.author}!` })
});
// TASK 12 - Use Promises
public_users.get('/async-get-books/author/:author', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const keys = Object.keys(books)
    const bookKey = keys.find(k => books[k].author === req.params.author)
    if (bookKey) resolve( res.status(200).json(books[bookKey]))
    else return reject({ message: `No books found by ${req.params.author}!` })  
  });

  return get_books.then(() => console.log("Promise for Task 12 resolved"))
  .catch(error => res.status(400).json(error))
});
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const keys = Object.keys(books)
  const bookKey = keys.find(k => books[k].title === req.params.title)
  if (bookKey) return res.status(200).json(books[bookKey])
  else return res.status(400).json({ message: `No books found titled ${req.params.title}!` })
});
// TASK 13 - Use Promises
public_users.get('/async-get-books/title/:title', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const keys = Object.keys(books)
    const bookKey = keys.find(k => books[k].title === req.params.title)
    if (bookKey) resolve( res.status(200).json(books[bookKey]))
    else reject({ message: `No books found titled ${req.params.title}!` })
    });

  return get_books.then(() => console.log("Promise for Task 13 resolved"))
  .catch(error => res.status(400).json(error))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn]
  if (book) return res.status(200).json(book.reviews);
  else return res.status(400).json({ message: `ISBN ${req.params.isbn} does not exist. No review could be returned` })
});

module.exports.general = public_users;
