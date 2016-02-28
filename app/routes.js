// app/routes.js

// load the todo model
var Todo = require('./models/todo');

// expose the routes to our app with module.exports
module.exports = function (app, passport) {

	// Home page (with login links) ==========================
	app.get('/', function (req, res) {
		res.render('./public/index.html'); // load the index.ejs file
	});

	// Login Page ===========================================
	app.get('/login', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// Signup page ==========================================
	app.get('/signup', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
 	}));


	// Facebook routes ======================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/'
	}));


	// Twitter routes =======================================
	app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );

    // Google routes =========================================
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );


	// logout ================================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// api ---------------------------------------

	//get all todos
	app.get('/api/todos', function(req, res) {
		// use mongoose to get all todos in the database
		Todo.find(function (err, todos) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(todos); // return all todos in JSON format
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos/', function (req, res) {
		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text: req.body.text,
			done: false
		}, function (err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function (err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
			});
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function (req, res) {
		Todo.remove({
			_id: req.params.todo_id
		}, function (err, rodo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Todo.find(function (err, todos) {
				if (err)
					res.send(err);
				res.json(todos);
			});
		});
	});

	// // application --------------------------------------------
	// app.get('*', function (req, res) {
	// 	res.sendfile('./public/index.html');  // load the single view file (angular will handle the page changes on the front-end)
	// });



};

// route middleware to make sure a user is logged in
function isLoggedIn (req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't authenticated, redirect them to the home page
	res.redirect('/');
}