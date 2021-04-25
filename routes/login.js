const express = require('express');
const User = require('../models/user')
const user = express.Router();
var validationText;

user.use(express.json());
user.use(express.urlencoded({extended: true}));

user.get('/check', async (req, res) => {
    try {
        const result = await User.find();

        if (result == null) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

user.get('/login', (req, res) => {
    validationText = '';
    res.render('login', {validationText});
});

user.post('/login', async (req, res) => {
    const user = await User.findOne({username: req.body.username})

    if (user == null) {
        validationText = 'User doesn\'t exist';
        res.render('login', {validationText});
    } else {
        user.comparePassword(req.body.password, (err, isMatch) => { 
            if (err) throw err;

            if (isMatch) {
                req.session.logged = true;
                req.session.user = user._id;
                res.redirect('/home');
            } else {
                validationText = 'Incorrect password'
                res.render('login', {validationText});
            }
        })
    }
});

user.get('/register', (req, res) => {
    validationText = '';
    res.render('register', {validationText});
});

user.post('/register', async (req, res) => {
    const user = await User.findOne({username: req.body.username})

    if (user != null && user.username == req.body.username) {
        validationText = 'User already exist';
        res.render('register', {validationText});
        res.sendStatus(400);
    } else {
        if (req.body.password1 != req.body.password2) {
            validationText = 'Password doesn\'t match'
            res.render('register', {validationText});
        } else {
            const user = new User({
                username: req.body.username,
                password: req.body.password1
            });
            const result = await user.save();   

            if (result == null) {
                res.sendStatus(400);
            } else {
                req.session.user = user._id;
                req.session.logged = true;
                res.redirect('/home');
            }
        }
    }
});

module.exports = user;
