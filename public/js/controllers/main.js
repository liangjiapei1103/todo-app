angular.module('todoController', [])

	// inject to Todos Service factory into out controller
	.controller('mainController', function ($scope, $http, Todos) {
		$scope.formData = {};


		// GET ===================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todo.get()
			.success(function (data) {
				$scope.todos = data;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});


		// CREATE ======================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// call the create function from out service (returns a promise object)
			Todos.create($scope.formData)

				// if successful creation, call out get function to get all the new todos
				.success(function (data) {
					$scope.formData = {}; // clear the form so out user is ready to enter another
					$scope.todos = data; // assign out new list of todos
				})
				.error(function (err) {
				console.log('Error: ' + err);
			});
				
		};


		// DELETE =================================================
		// delete a todo after checking it 
		$scope.deleteTodo = function (id) {

			Todos.delete(id)
				// if successgul deletion, call our get function to get all the todos
				.success(function (data) {
					$scope.todos = data;
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});
		};
	});