const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
let ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/assets', express.static(__dirname + '/public'));
//session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
var db;

MongoClient.connect('mongodb://crufener:jenniferr1@ds057066.mlab.com:57066/myproducts', (error, database) => {
    if (error != null) {
        throw error;
        return;
    }
    db = database;
});


app.listen(3000, () => console.log(`server running on port 3000`));

app.get('/', function(request, response) {
    console.log(`Request recieved at: '${request.url}'`);
    response.render('index.ejs');
});
//get request for login
//render login page
app.get('/login', (req, res) => res.render('login'));
//handle POST request from login page
//create a route to handle  POST request(login)
app.post('/login', (req, res) => {
    console.log(req.header);
    console.log(`successfully connected to database`);

    db.collection('login').findOne({
            userName: req.body.userName,
            password: req.body.password
        },
        function(err, user) {
            if (!user) res.redirect('/error.ejs');
            else {
                req.session.user = user;
                console.log(req.session.user);
                res.redirect('/profile');
            }

        }
    );
});
//render signup page on GET request
app.get('/signup', (req, res) => res.render('signup'));
//handle request for signup page on POST
app.post('/signup', (req, res) => {
    db.collection('login').save({
            userName: req.body.userName,
            password: req.body.password
        },
        function(err, user) {
            if (!user) res.render('error');
            req.session.user = user;
            res.render('profile');
        }
    );
});
//profile page
app.get('profile', (req, res) => {
    //get user data from session storage
    let user = req.session.userName;
    res.render('profile', {
        userName: user
    });
});
//error page
app.get('error', (req, res) => res.render('error'));

//delete session
app.get('logout', (req, res) => {
    req.session.destroy();
    res.redirect('index');
});
