// server.js

// set up ======================================================

var express = require('express');  
var app = express();  // create our app with express
var mongoose = require('mongoose');  // mongoose for mongodb
var morgan = require('morgan');  // log requests to the console (express4)
var bodyParser = require('body-parser');  // pull information from HTML POST (express4)
var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)

var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var database = require('./config/database');  // load the config
var port = process.env.PORT || 3000;

// configuration ===============================================

mongoose.connect(database.url); // connect to mongoDB database on mongoLab.com

require('./config/passport')(passport);  // pass passport for configuration

app.use(express.static(__dirname + '/public'));  // set the static files location /public, /public/img will be /img for users
app.use(morgan('dev'));  // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));  // parse app;ocation/x-www-form-urlencoded
app.use(bodyParser.json());  // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
	secret: 'abc123',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =======================================================
require('./app/routes.js')(app, passport);


// listen (start app with node server.js) ========================

app.listen(port, function () {
	console.log("App listening on port " + port);
});



