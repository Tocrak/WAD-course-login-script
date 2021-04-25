const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const home = require('./routes/home');
const login = require('./routes/login');
const account = require('./routes/account.js');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/proj3db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => {console.error(error)});
db.once('open', () => {console.log('mongodb connected')});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'virgi',
    resave: true,
    saveUninitialized: true,
    cookie: {}
}));

app.use('/home', (req, res, next) => {
    if (req.session.logged) {
        next();
    } else {
        req.session.logged = false;
        res.redirect('/login');
    }
})

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.use('/home', home)
app.use('/home', account)
app.use('/', login)

app.listen(port, () => {
    console.log('Server Started');
})