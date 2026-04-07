const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//task 6
public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req.body)
    if(username && password){
      if(isValid(username)){
        users.push({username:username,password:password});
        return res.status(200).json({message: "User registered successfully"});
      }
      else{
        return res.status(400).json({message: "Username already exists"});
      }
    }else{
      return res.status(400).json({message: "Username or password not provided"});
    }
});


// Get the book list available in the shop
//task 1
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  if (books) {
     return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
     return res.status(404).json({ message: "No books found" });
  }
});

// Get book details based on ISBN
//task 2
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    if(books[isbn]){
        return res.status(200).send(JSON.stringify(books[isbn],null,4));
       }
    else{
        return res.status(404).send("No book found with ISBN "+isbn);
    }
 });
  
// Get book details based on author
//task 3
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksFound = [];
  for (let isbn in books) {
    if (books[isbn].author == author) {
        booksFound.push(books[isbn]);
    }
  }
  if (booksFound.length < 0) {
    return res.status(200).send(JSON.stringify(booksFound,null,4));
    }
    else{
       return res.status(404).send("No book found with author "+author);
    }
});

// Get all books based on title
//task 4
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let booksFound = [];
    for (let isbn in books) {
      if (books[isbn].title == title) {
          booksFound.push(books[isbn]);
      }
    }
    if (booksFound.length < 0) {
      return res.status(200).send(JSON.stringify(booksFound,null,4));
      }
      else{
         return res.status(404).send("No book found with author "+title);
      }
  });

//  Get book review
//task 5
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    if(books[isbn]){
      return res.status(200).send(JSON.stringify(books[isbn].reviews,null,4));
    }
    else{
      return res.status(404).send("No book found with ISBN "+isbn);
    }
});

module.exports.general = public_users;
