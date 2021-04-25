const express = require('express');
const User = require('../models/user')
const home = express.Router();

home.get('/', async (req, res) => {
    const user = await User.findById(req.session.user)

    if (user != null) {
        res.render('home', {username: user.username})
    } else {
        res.sendStatus(400);
    }
    
})

module.exports = home;