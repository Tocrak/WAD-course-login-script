const express = require('express');
const User = require('../models/user')
const account = express.Router();
var validationText;

account.get('/updatePassword', (req, res) => {
    validationText = '';
    res.render('updatePassword', {validationText});
});

account.post('/updatePassword', async (req, res) => {
    const user = await User.findById(req.session.user)

    if (user != null) {
    await user.comparePassword(req.body.password0, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            if (req.body.password1 != req.body.password2) {
                validationText = 'Password doesn\'t match'
                res.render('updatePassword', {validationText});
            } else {
                user.password = req.body.password1
                const result = await user.save();   

                if (result == null) {
                    res.sendStatus(400);
                } else {
                    res.redirect('/home');
                }
            }
        } else {
            validationText = 'Incorrect password'
            res.render('updatePassword', {validationText});
        }
    })
    } else {
        res.sendStatus(400);
    }
});

account.get('/deleteAccount', (req, res) => {
    validationText = '';
    res.render('deleteAccount', {validationText});
});

account.post('/deleteAccount', async (req, res) => {
    const user = await User.findById(req.session.user)

    if (user != null) {
    await user.comparePassword(req.body.password, async (err, isMatch) => { 
        if (err) throw err;

        if (isMatch) {
            await User.findByIdAndDelete(user._id);
            req.session.logged = false;
            req.session.destroy();
            res.redirect('/home')
        } else {
            validationText = 'Incorrect password'
            res.render('deleteAccount', {validationText});
        }
    })
    } else {
        res.sendStatus(400);
    }
});

module.exports = account;