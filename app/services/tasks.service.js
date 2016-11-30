(function(){

angular.module('app')
	.service('TasksService', 
		function($q, $http){

		this.getTaskDetails = function(){
			return $http({
				method: "GET",
				url : "/api/tasks",
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)

			}).then(function(response){
				return response.data;
			}, function(response){
				// $scope.errorMsg = "Oj, jeblo";
			});
		}

			

		});
})();
