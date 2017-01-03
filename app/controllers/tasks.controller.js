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

				UserService.getUsers().then(function(users){
					$scope.Users = users;
					for(var i = 0; i < $scope.Users.length; i++){
						$scope.Users[i].ticked = false;
					}
				});

				$scope.guestsList = [];
				
				// Add task
				$scope.clearInputFromAddTask = function() {
					$scope.taskName = null;
					$scope.date = null;
					$scope.time = null;
					$scope.description = null;
					$scope.guestsList = null;
				}
				$scope.saveTask = function(){
					
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.time.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.time.getMinutes().toString())).slice(-2);
					
					var people = $scope.guestsList.replace(/ /g,'').split(',');
					$scope.validIDs = [];

					for(var i=0; i<people.length; i++){
						UserService.getUserID(people[i]).then(function(user){
							$scope.validIDs.push(user[0]._id.toString());
							
							console.log($scope.validIDs);

						});
					}



		
					var Task = {
						name: $scope.taskName,
						startDate: date,
						startTime: time,
						description: $scope.description,
						guestList:  $scope.guestsList,
					}


					// TasksService.addTask(Task, user);
					
					// TasksService.getTaskDetails(user).then(function(tasks){
					// 	$scope.Tasks = tasks;
					// });
				
				}
				$scope.saveEditedTask = function(){
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.date.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.date.getMinutes().toString())).slice(-2);
					
					var Task = {
						name: $scope.taskName,
						startDate: date,
						startTime: time,
						description: $scope.description,
						guestList: $scope.guestsList
					}
					TasksService.editTask($scope.taskID, Task);
					
					TasksService.getTaskDetails(user).then(function(tasks){
						$scope.Tasks = tasks;
					});
				}

				$scope.editTask = function(obj){
					var taskID = obj.target.attributes.data.value
					$scope.taskID = taskID;
					var Task = TasksService.getTask(taskID).then(function(task){
						$scope.showModal = true;
						$scope.editButton = true;

						var newDate = new Date(task.startDate);
						var hours = task.startTime.substring(0,2);
						var minutes = task.startTime.slice(-2);
						
						var newTime = new Date();

						newTime.setHours(hours);
						newTime.setMinutes(minutes);

						console.log(newTime);

						$scope.taskName = task.title;
						$scope.date = newDate;
						$scope.time = newTime;
						$scope.description = task.description;
						$scope.guestList = task.guests;

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