(function(){
  angular.module('app')
  .controller('TasksCtrl',
    function($scope, $timeout, TasksService, UserService){
    var authToken = window.localStorage.getItem("yourTokenKey");
	var taskToAdd;

   	UserService.getUserDetails(authToken).then(function(user){				
				// Get my tasks list
				TasksService.getTaskDetails(user).then(function(tasks){
						$scope.Tasks = tasks;
				});
				
				// Add task
				$scope.clearInputFromAddTask = function() {
					$scope.taskName = null;
					$scope.startDate = null;
					$scope.description = null;
					$scope.guestsList = null;
				}
				$scope.saveTask = function(){
					var date = new Date(($scope.startDate.getTime()-$scope.startDate.getTimezoneOffset()*60000));

					var Task = {
						name: $scope.taskName,
						startDate: $scope.startDate.toISOString(),
						description: $scope.description,
						guestList: $scope.guestsList
					}
					TasksService.addTask(Task, user);
					
					TasksService.getTaskDetails(user).then(function(tasks){
						$scope.Tasks = tasks;
					});
				}

				$scope.removeThis = function(obj){
					TasksService.removeTask(obj.target.attributes.data.value);
					
					var f = function(){
						TasksService.getTaskDetails(user).then(function(tasks){
							$scope.Tasks = tasks;
						});
					}

					$timeout(f, 500);
				}



		});	
		

		
		
      
     





  });


})();