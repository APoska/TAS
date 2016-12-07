(function(){
  angular.module('app')
  .controller('TasksCtrl',
    function($scope, TasksService, UserService){
    	var authToken = window.localStorage.getItem("yourTokenKey");

   	UserService.getUserDetails(authToken).then(function(user){
			$scope.User = user;
			
			// Get my tasks list
			TasksService.getTaskDetails(user).then(function(tasks){
					$scope.Tasks = tasks;
			});

		});

		
      
     





  });


})();