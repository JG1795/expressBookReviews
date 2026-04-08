const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const Axios = require("axios")

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
/*
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  if (books) {
     return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
     return res.status(404).json({ message: "No books found" });
  }
});
*/



/*
//task10 axios version
public_users.get('/', async function (req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(JSON.stringify(books, null, 4));
      } else {
        reject("No books found");
      }
    });
  };

  try {
    const formattedBooks = await getBooks();
    res.status(200).send(formattedBooks);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});
*/




//task 10---------------------
public_users.get('/', function (req, res) {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(JSON.stringify(books, null, 4));
        } else {
          reject("No books found");
        }
      });
    };
  
    getBooks()
      .then((formattedBooks) => {
        res.status(200).send(formattedBooks);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  });

// Get book details based on ISBN
//task 2
/*
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
*/

 //task 11--------------
 public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    const bookByIsbn = (isb) => {
        return new Promise((resolve, reject) => {
          if (books[isb]) {
            resolve(JSON.stringify(books[isb], null, 4));
          } else {
            reject("No book found with ISBN "+isb);
          }
        });
    };
    bookByIsbn(isbn)
        .then((bookFound) => {
          res.status(200).send(bookFound);
        })
        .catch((error) => {
          res.status(404).json({ message: error });
        });
 });
  
// Get book details based on author
//task 3
/*
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
*/

//task12 -------------
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    const bookByAuthor = (authorName) => {
        return new Promise((resolve, reject) => {
            const booksFiltered = books.filter((b) => b.author === authorName)
          if (booksFiltered.length > 0) {
            resolve(JSON.stringify(booksFiltered, null, 4));
          } else {
            reject("No books found with Author: "+authorName);
          }
        });
    }; 
    bookByAuthor(author)
        .then((booksFound) => {
          res.status(200).send(booksFound);
        })
        .catch((error) => {
          res.status(404).json({ message: error });
        });
  });

// Get all books based on title
/*
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
  */

//task13--------------
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    const bookByTittle = (bookTitle) => {
        return new Promise((resolve, reject) => {
            const booksFiltered = books.filter((b) => b.title === bookTitle)
          if (booksFiltered.length > 0) {
            resolve(JSON.stringify(booksFiltered, null, 4));
          } else {
            reject("No books found with Title: "+bookTitle);
          }
        });
    }; 
    bookByAuthor(title)
        .then((booksFound) => {
          res.status(200).send(booksFound);
        })
        .catch((error) => {
          res.status(404).json({ message: error });
        });
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
