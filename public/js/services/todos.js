// js/services/todos.js

angular.module('todoService', [])

	// super simple service
	// each function returns a promise object
	.factory('Todos', function($http) {
		return {
			get: function (list_id) {
				return $http.get('/api/list/' + list_id);
			},
			create: function (list_id, todoData) {
				return $http.post('/api/list/' + list_id, todoData);
			},
			delete: function (list_id, todo_id) {
				return $http.delete('/api/list/' + list_id + '/' + todo_id);
			}
		}
	});