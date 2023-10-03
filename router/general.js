const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let {username, password} = req.body;
    return isValid(username)
        .then(() => {
            users.push({username, password})
            return res.status(200).json({message: "Registered successfully. you can Login now!"});
        })
        .catch(err => {
            return res.status(400).send(err.message)
        })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    function getBooks(callback) {
        callback(null, books)
    }
    getBooks(function (err, result) {
        if(err)
            return res.status(500).send(err.message)

        return res.status(200).json(result);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let {isbn} = req.params;
    function searchByISBN(isbn) {
        return new Promise((resolve, reject) => {
            resolve(books[isbn])
        })
    }

    searchByISBN(isbn)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(500).send(err.message))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let {author} = req.params;
    function searchByAuthor(author) {
        return new Promise((resolve, reject) => {
            const booksByAuthor = {}
            for (let key of Object.keys(books)) {
                if (books[key].author === author)
                    booksByAuthor[key] = books[key]
            }
            resolve(booksByAuthor)
        })
    }
    searchByAuthor(author)
        .then(result => res.status(200).json({booksByAuthor:result}))
        .catch(err => res.status(500).send(err.message))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let {title} = req.params;
    
    function searchByTitle(title) {
        return new Promise((resolve, reject) => {
            const booksByTitle = {}
            for (let key of Object.keys(books)) {
                if (books[key].title === title)
                    booksByTitle[key] = books[key]
            }
            resolve(booksByTitle)
        })
    }

    searchByTitle(title)
        .then(result => res.status(200).json({booksByTitle:result}))
        .catch(err => res.status(500).send(err.message))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let {isbn} = req.params;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
