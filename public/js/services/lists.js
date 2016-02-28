// js/services/lists.js

angular.module('listService', [])

	// super simple service
	// each function returns a promise object
	.factory('Lists', function($http) {
		return {
			get: function () {
				return $http.get('/api/lists');
			},
			create: function (listData) {
				return $http.post('/api/lists', listData);
			},
			delete: function (id) {
				return $http.delete('/api/list/' + id);
			},
			change: function (id) {
				return $http.get('/api/list/' + id);
			}
		}
	});