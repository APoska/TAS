(function(){
  angular.module('app')
  .controller('publicMeetTaskCtrl',
    function($scope, TasksService, MeetingsService){
    	TasksService.getAllTasks().then(function(tasks){
    		$scope.allTasks = tasks;
    	});
    	MeetingsService.getAllMeetings().then(function(meetings){
    		$scope.allMeetings = meetings;
    	});
    });
})();
