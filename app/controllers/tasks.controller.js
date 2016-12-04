(function(){
  angular.module('app')
  .controller('TasksCtrl',
    function($scope, TasksService, UserService){
    	var authToken = window.localStorage.getItem("yourTokenKey");
    	var userDetails;

    	UserService.getUserDetails(authToken).then(function(user){
			$scope.User = user;
			userDetails = user;
		});

		TasksService.getTaskDetails().then(function(tasks){
			$scope.Tasks = tasks;
		});
      
     





  });


})();