(function(){

angular.module('app')
	.service('TasksService', 
		function($q, $http){

		this.getTaskDetails = function(user){
			return $http({
				method: "GET",
				url : "/api/tasks?user="+user._id,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)

			}).then(function(response){
				return response.data;
			}, function(response){
				return response.err;
			});
		}
		
		this.getTask = function(taskID){
			return $http({
				method: "GET",
				url : "/api/tasks/"+taskID,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)

			}).then(function(response){
				return response.data;
			}, function(response){
				return response.err;
			});
		}

		this.addTask = function(task, taskCreator){
			$http({
				method: "POST",
				url: "/api/tasks",
   				headers: {'Content-Type': 'application/json'},
				data: JSON.stringify({
					title: task.name,
					startDate:  task.startDate,
					description: task.description,
					user: taskCreator._id,
					guests: task.guestList })
				
			}).then(function(res){
				return res;
			}), function(res){
				return res.err;
			}
		}
		this.editTask = function(id, task){
			$http({
				method: "PATCH",
				url: "/api/tasks/"+id,
   				headers: {'Content-Type': 'application/json'},
				data: JSON.stringify({
					title: task.name,
					startDate:  task.startDate,
					description: task.description,
					guests: task.guestList })
				
			}).then(function(res){
				return res;
			}), function(res){
				return res.err;
			}
		}
		this.removeTask = function(id){
			return $http({
				method: "DELETE",
				url: "/api/tasks/"+id,				
			}).then(function(res){
				return res;
			}), function(res){
				return res.err;
			}
		}

			

		});
})();
