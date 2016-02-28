angular.module('todoController', [])

	// inject to Todos Service factory into out controller
	.controller('mainController', function ($scope, $http, Todos, Lists) {
		$scope.formData = {};
		$scope.currentList;


		// GET ===================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		Todo.get(id)
			.success(function (data) {
				$scope.todos = data.todos;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});

		$scope.getList = function (id) {
			Todos.get(id)
				.success(function (data) {
					$scope.todos = data.todos;
					$scope.listTitle = data.listTitle;
					$scope.currentList = data;
				})
		}

		List.get()
			.success(function (data) {
				$scope.lists = data;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});



		// CREATE ======================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			// call the create function from out service (returns a promise object)
			Todos.create($scope.currentList._id, $scope.formData)

				// if successful creation, call out get function to get all the new todos
				.success(function (data) {
					$scope.formData = {}; // clear the form so out user is ready to enter another
					$scope.todos = data; // assign out new list of todos
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});
				
		};

		$scope.createList = function () {

			Lists.create($scope.formData)

				.success(function (data) {
					$scope.listTitle = formData.list;
					$scope.formData = {};
					$scope.lists = data;
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});

		};



		// DELETE =================================================
		// delete a todo after checking it 
		$scope.deleteTodo = function (todo_id) {

			Todos.delete($scope.currentList._id, todo_id)
				// if successgul deletion, call our get function to get all the todos
				.success(function (data) {
					$scope.todos = data.todos;
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});

		};

		$scope.deleteList = function (id) {

			Lists.delete(id)
				// if successgul deletion, call our get function to get all the todos
				.success(function (data) {
					$scope.lists = data;
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});

		};

		$scope.changeList = function (id) {
			alert('clicked');
			Lists.change(id)
				.success(function (data) {
					$scope.listTitle = data.listTitle;
					$scope.todos = data.todos;
				})
				.error(function (err) {
					console.log('Error: ' + err);
				});
		};

		$scope.test1 = function () {
			$scope.test = test+1;
		}

		$scope.test2 = function () {
			$scope.test = test+2;
		}


	});