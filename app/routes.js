// app/routes.js

// load the todo model
var Todo = require('./models/todo');
var User = require('./models/user');
var List = require('./models/list');

// expose the routes to our app with module.exports
module.exports = function (app, passport) {

	// Home page (with login links) ==========================
	app.get('/', function (req, res) {
		res.render('./index.ejs', { 
			user: req.user, 
			message: 'You need to login to post Todos' 
		}); // load the index.ejs file
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
	app.get('/api/list/:list_id', isLoggedIn, function(req, res) {

		 if (req.params.list_id != ':list_id') {
		
			console.log("req.params.list_id= " + req.params.list_id );
			// use mongoose to get all todos in the database
			List
			.findOne({
				_id: req.params.list_id
			})
			.populate('todos')
			.exec(function (err, list) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err) {
					console.log("Error1: " + err);
					return res.send(err);
				}

				res.json(list); // return all todos in JSON format
			});
		} else {
			// use mongoose to get all todos in the database
			List
			.findOne({
				_id: req.user.info.currentList,
			})
			.populate('todos')
			.exec(function (err, list) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err) {
					console.log("Error2: " + err);
					return res.send(err);
				}
				console.log("todos: " + list);

				res.json(list); // return all todos in JSON format
			});
		}
	

		
	});

	// create todo and send back all todos after creation
	app.post('/api/list/:list_id', isLoggedIn, function (req, res) {
		
		if (req.params.list_id != ':list_id') {

			var newTodo = new Todo();
			newTodo.owner = req.user._id;
			newTodo.list = req.params.list_id,
			newTodo.text = req.body.text,
			newTodo.done = false;

			newTodo.save(function (err, newTodo) {
				if (err) return console.log(err);
				List.findOne({_id: req.params.list_id})
				.populate('todos')
				.exec(function (err, list) {
					console.log(list);
					list.todos.push(newTodo);
					list.save(function (err, list) {
						if (err) return console.log(err);
						return res.json(list);
					});
				});
			});
		} else {
			// create a todo, information comes from AJAX request from Angular
			
			var newTodo = new Todo();
			newTodo.owner = req.user._id;
			newTodo.list = req.user.info.currentList,
			newTodo.text = req.body.text,
			newTodo.done = false;

			newTodo.save(function (err, newTodo) {
				if (err) return console.log(err);
				List.findOne({_id: req.user.info.currentList})
				.populate('todos')
				.exec(function (err, list) {
					console.log(list);
					list.todos.push(newTodo);
					list.save(function (err, list) {
						if (err) return console.log(err);
						return res.json(list);
					});
				});
			});
		}
	});

	// delete a todo
	app.delete('/api/list/:list_id/:todo_id', isLoggedIn, function (req, res) {
		
		if (req.params.list_id != ':list_id') {

			Todo.remove({
				_id: req.params.todo_id
			}, function (err, todo) {
				if (err)
					return res.send(err);

				console.log('After remove: ' + todo);

				// use mongoose to get all todos in the database
				List
				.findOne({
					_id: req.params.list_id
				})
				.populate('todos')
				.exec(function (err, list) {
					// if there is an error retrieving, send the error. nothing after res.send(err) will execute
					if (err)
						return console.log(err);

					return res.json(list); // return the list in JSON format
				});
			});
		} else {
			Todo.remove({
				_id: req.params.todo_id
			}, function (err, todo) {
				if (err)
					return res.send(err);

				console.log('After remove: ' + todo);

				// use mongoose to get all todos in the database
				List
				.findOne({
					_id: req.user.info.currentList
				})
				.populate('todos')
				.exec(function (err, list) {
					// if there is an error retrieving, send the error. nothing after res.send(err) will execute
					if (err)
						return console.log(err);

					return res.json(list); // return the list in JSON format
				});
			});
		}
	});

	// GET /api/lists
	app.get('/api/lists', isLoggedIn, function (req, res) {
		List.find({owner: req.user._id})
		.exec(function (err, lists) {
			if (err) {
				console.log(err);
				return res.send(err);
			}
			console.log(lists);
			return res.json(lists);
		});
	});

	// create list and send back all lists after creation
	app.post('/api/lists/', isLoggedIn, function (req, res) {
		// create a todo, information comes from AJAX request from Angular
		List.create({
			owner: req.user._id,
			listTitle: req.body.list
		}, function (err, list) {
			if (err)
				return res.send(err);
			res.json(list);
			// use mongoose to get all todos in the database
			// List.find({owner: req.user._id})
			// .exec(function (err, lists) {
			// 	// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			// 	if (err)
			// 		return res.send(err);

			// 	res.json(lists); // return all todos in JSON format
			// });
		});
	});

	// delete a todo
	app.delete('/api/list/:list_id', isLoggedIn, function (req, res) {
		List.remove({
			_id: req.params.list_id
		}, function (err, rodo) {
			if (err)
				return res.send(err);

			// use mongoose to get all todos in the database
			List.find({owner: req.user._id})
			.exec(function (err, lists) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					return res.send(err);

				res.json(lists); // return all todos in JSON format
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