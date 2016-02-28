// public/core.js

var todo = angular.module('todo', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.listTitle = 'Todo List';
	$scope.lists = [];
	$scope.currentList;

	// when landing on the page, get all todos and show them
	$http.get('/api/list/:list_id')
		.success(function (list) {
			$scope.todos = list.todos;
			$scope.listTitle = list.listTitle;
			$scope.currentList = list;
		})
		.error(function (err) {
			console.log('Error: ' + err);
		});

	$scope.getList = function (id) {
		$http.get('/api/list/' + id)
			.success(function (list) {
				$scope.todos = list.todos;
				$scope.listTitle = list.listTitle;
				$scope.currentList = list;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};

	// when landing on the page, get all lists and show them
	$http.get('/api/lists')
		.success(function (data) {
			$scope.lists = data;
		})
		.error(function (err) {
			console.log('Error: ' + err);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/list/' + $scope.currentList._id, $scope.formData)
			.success(function (data) {
				$scope.formData = {}; // clear the form so out user is ready to enter another
				$scope.todos = data.todos;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};

	// when submitting the create list form, send the text to the node API
	$scope.createList = function() {
		$http.post('/api/lists', $scope.formData)
			.success(function (data) {
				$scope.formData = {}; // clear the form so out user is ready to enter another
				$scope.listTitle = data.listTitle;
				$scope.todos = data.todos;

			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};

	$scope.changeList = function (id) {
		$http.get('/api/list/' + id)
			.success (function (data) {
				$scope.todos = data.todos;
				$scope.listTitle = data.listTitle;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};

	// delete a todo after checking it 
	$scope.deleteTodo = function (todo_id) {
		$http.delete('/api/list/' + $scope.currentList._id + '/' + todo_id)
			.success(function (data) {
				$scope.todos = data.todos;
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};
	
}