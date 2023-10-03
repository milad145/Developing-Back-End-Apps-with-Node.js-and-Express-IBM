const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return new Promise((resolve, reject) => {
        let user = users.filter(user => user.username === username)[0]
        if (user)
            reject(new Error("username exist already. please choose another username!"))
        else
            resolve(true)
    })
}

const authenticatedUser = (username, password) => { //returns boolean
    return new Promise((resolve, reject) => {
        let user = users.filter(user => user.username === username && user.password === password)[0]
        if (!user)
            reject(new Error("Username or Password are incorrect!"))
        else
            resolve(user)
    })
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let {username, password} = req.body;
    return authenticatedUser(username, password)
        .then(user => {
            let accessToken = jwt.sign({
                data: user
            }, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken
            }
            return res.status(200).send("Customer successfully logged in");
        })
        .catch(err => {
            return res.status(404).send(err.message)
        })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const {review} = req.query;
    const {username} = req.user.data;
    books[isbn].reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const {isbn} = req.params;
    const {username} = req.user.data;
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted.`);
    } else
        return res.status(400).send(`You don't have any review for the book with ISBN ${isbn}.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
