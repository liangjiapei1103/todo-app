// public/core.js

var todo = angular.module('todo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todos') 
		.success(function (data) {
			$scope.todos = data;
			console.log(data);
		})
		.error(function (err) {
			console.log('Error: ' + err);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/todos', $scope.formData)
			.success(function (data) {
				$scope.formData = {}; // clear the form so out user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};

	// delete a todo after checking it 
	$scope.deleteTodo = function (id) {
		$http.delete('/api/todos/' + id)
			.success(function (data) {
				$scope.todos = data;
				console.log(data);
			})
			.error(function (err) {
				console.log('Error: ' + err);
			});
	};
	
}