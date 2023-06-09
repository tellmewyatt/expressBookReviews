const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  const username = req.session.authorization.username
  const content = {...req.body, username: username}
  if(book) {
    const keys = Object.keys(book.reviews)
    const key = keys.find(k => book.reviews[k].username === username)
    if(key) {
      book.reviews[key] = content
      return res.status(200).json({message: `Successfully modified review for ${req.params.isbn}`});
    }else {
      let lastKey = 0
      if(keys.length > 0) {
        lastKey = parseInt(keys[keys.length - 1])
      }
      const newKey = lastKey + 1;
      book.reviews[newKey] = content
      return res.status(200).json({message: `Successfully created review for ${req.params.isbn}`});
    }
  }
  else return res.status(404).json({message: "Error! No Book exists at that isbn"})
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  const username = req.session.authorization.username
  if(book) {
    const keys = Object.keys(book.reviews)
    const key = keys.find(k => book.reviews[k].username === username)
    console.log(keys, key)
    if(key) {
      const review = book.reviews[key]
      delete book.reviews[key]
      res.status(200).json({message: `Successfully deleted your review of ${req.params.isbn} `})
    }
    else return res.status(404).json({message: `Error! No review for user ${username} for book ${req.params.isbn}`})
  }
  else return res.status(404).json({message: `Error! No Book exists at ISBN ${req.params.isbn} `})
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
