(function(){
  angular.module('app')
  .controller('TasksCtrl',
    function($scope, $state, $stateParams, $timeout, TasksService, UserService){
    var authToken = window.localStorage.getItem("yourTokenKey");
	var tasksDate = $state.params.date;
	var date=null;
	if(tasksDate != null || tasksDate != undefined){
		var dd = tasksDate.getDate(); var mm = tasksDate.getMonth()+1; var yy = tasksDate.getFullYear();
		if(mm < 10) {mm = '0' + mm;}
		if(dd < 10) {dd = '0' + dd;}
		var date = yy + '-' + mm + '-' + dd;
	}
	var dailyTasks = [];
   	UserService.getUserDetails(authToken).then(function(user){				
				// Get my tasks list
				TasksService.getTaskDetails(user).then(function(tasks){
					if(date==null){
						$scope.Tasks = tasks;
						$scope.when = "All tasks";
					}
					else if(date!=null){
						for(var i in tasks){
							if(tasks[i].startDate == date){
								dailyTasks.push(tasks[i]);
							}
						}
						$scope.Tasks = dailyTasks;
						$scope.when = "Tasks at " + date;
					}
				});

				$scope.taskStatus = [
    				{ label: 'public'},
    				{ label: 'private'}
  				];

  				$scope.statusFlag = $scope.taskStatus[0];

				// Add task
				$scope.clearInputFromAddTask = function() {
					$scope.taskName = null;
					$scope.date = null;
					$scope.time = null;
					$scope.description = null;
					$scope.statusFlag = null;
					$scope.guestsList = null;
				}

				$scope.saveTask = function(){
					
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.time.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.time.getMinutes().toString())).slice(-2);		
					var people = $scope.guestsList.replace(/ /g,'').split(',');
					var loginObj = {login : []}
					for(var i=0; i < people.length; i++){
						loginObj.login.push(people[i]);
					}

					var Task = {
						name: $scope.taskName,
						startDate: date,
						startTime: time,
						description: $scope.description,
						status: ($scope.statusFlag.label).toString(),
						guestList: {}
					}
					
					var promise = UserService.getUsersID(loginObj)		

					promise.then(function(res){
						var personObj = [];

						for(var i=0; i<res.length; i++){
							if(res[i]._id != user._id)
							personObj.push({
								id : res[i]._id,
								login : res[i].login, 
								flag: "pending"
							});
						}

						Task.guestList = personObj

						TasksService.addTask(Task, user);

						TasksService.getTaskDetails(user).then(function(tasks){
							$scope.Tasks = tasks;
						});

					})

				
				}
				$scope.saveEditedTask = function(){
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.date.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.date.getMinutes().toString())).slice(-2);
					
					var Task = {
						name: $scope.taskName,
						startDate: date,
						startTime: time,
						description: $scope.description,
						status: $scope.statusFlag.label,
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

						$scope.taskName = task.title;
						$scope.date = newDate;
						$scope.time = newTime;
						$scope.description = task.description;
						$scope.status = task.status;
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
