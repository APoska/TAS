(function(){

angular.module('app')
	.service('UserService', 
		function($q, $http){

		this.getUserDetails = function(authToken){
			return $http({
				method: "GET",
				url : "/api/checkauth",
				headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : authToken}  // set the headers so angular passing info as form data (not request payload)

			}).then(function(response){
				return response.data;
			}, function(response){
				return response.err;
			});
		}

			

		});
})();
