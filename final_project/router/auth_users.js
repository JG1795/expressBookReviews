const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
//task7
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  //check 
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "wrong credentials"});
  } else {
    // generate token
    let logToken = jwt.sign({ username: username }, "access", { expiresIn: "1h" });
    //save token
    req.session.authorization = { logToken, username }
    return res.status(200).json({message: "User logged in successfully", token: token});
  }
});

// Add a book review
//task8
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.authorization.username;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message:"review added"});  
  } else {
    return res.status(404).json({ message: "book not found" });
  }
});

// delete a book review
//task9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;
    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "reeview deleted" });
    } else {
        return res.status(404).json({ message: "review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
