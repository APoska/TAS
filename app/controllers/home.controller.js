angular.module('app')
.controller('HomeCtrl', function($scope, UserService, TasksService, MeetingsService, $state) {
	$scope.logout = function() {
		UserService.logout();
		$state.go('login');
	};

	$scope.tasks = function(calDate) {
		$state.go('tasks', {date: calDate});
	};

	$scope.publicMeetTask = function() {
		$state.go('publicMeetTask');
	}

	$scope.meetings = function() {
		$state.go('meetings');
	};

	var authToken = window.localStorage.getItem("yourTokenKey");
	var allTasks = [];
	var allMeetings = [];
   	UserService.getUserDetails(authToken).then(function(user){				
				// Get my meeting list
				MeetingsService.getMeetingDetails(user).then(function(meetings){
					$scope.Meetings = meetings;
					allMeetings = meetings;
				});
				// Get my tasks list
				TasksService.getTaskDetails(user).then(function(tasks){
						$scope.Tasks = tasks;
						allTasks = tasks;
						generateCalendar();
				});
	   });

	var date = new Date();
	var yy = date.getFullYear(); var mm = date.getMonth(); var dd = date.getDate(); var currentMonth = mm; var currentYear = yy;

	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var firstDay = new Date(yy, mm, 1);
	var daynumb = firstDay.getDay();
	var lastDay = new Date(yy, mm+1, 0);
	var daycount = lastDay.getDate();
	var days = [];
	var prevMonthDays = [];

	function generateCalendar(){
		var firstDay = new Date(yy, mm, 1);
		var daynumb = firstDay.getDay();
		var lastDay = new Date(yy, mm+1, 0);
		var daycount = lastDay.getDate();
		if(daynumb===0)
			daynumb=7;
		//array of days from other month to hide
		for(var i=1; i<daynumb; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth()-1, 8); prevMonthDays.push({day: foo});
		}
		//array of days from actual month
		for(var i=1; i<=daycount; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);	days.push({day: foo});
			var y=firstDay.getFullYear(); var m = firstDay.getMonth()+1;
			if(m<10){
				m = '0' + m;
			}
			var taskCount = 0;
			var meetCount = 0;
			if(i<10){
				i = '0' + i;
			}
			var actualDate = y + '-' + m + '-' + i;
			//counting tasks in actual day
			for(var j=0; j<allTasks.length; j++){
				if(allTasks[j].startDate == actualDate){
					taskCount++;
				}
			}
			for(var j=0; j<allMeetings.length; j++){
				if(allMeetings[j].startDate == actualDate){
					meetCount++;
				}
			}
			days[days.length-1].meetCount = meetCount; //add number of meetings to day obj
			days[days.length-1].taskCount = taskCount; //add number of task to day obj	
			//add 
			if(i==dd && mm == currentMonth && yy == currentYear){
				days[days.length-1].today = true;
			}
			else{
				days[days.length-1].today = false;
			}
		}
		$scope.prevMonthDays = prevMonthDays;
		$scope.days=days;
	};
	//next month
	$scope.actualMonth = function() {
		mm = currentMonth; yy = currentYear;
		days=[];prevMonthDays=[];
			generateCalendar();
		currentDate = months[mm] + '\n' + yy; $scope.month = currentDate;
	};
	//previous month
	$scope.nextMonth = function() {
		mm++;
		if(mm===12){
			mm=0; yy++;
		}
		days=[];prevMonthDays=[];
				generateCalendar();
		currentDate = months[mm] + '\n' + yy; $scope.month = currentDate;
	};
	//back to actual month
	$scope.prevMonth = function() {
		mm--;
		if(mm===-1){
			mm=11; yy--;
		}
		days = [];prevMonthDays=[];
		generateCalendar();
		currentDate = months[mm] + '\n' + yy; $scope.month = currentDate;
	};
	
	currentDate = months[mm] + '\n' + yy;
	$scope.month = currentDate;

	$scope.weekdays=[{"shortName":"MON"}, {"shortName":"TUE"}, {"shortName":"WED"}, {"shortName":"THU"}, {"shortName":"FRI"}, {"shortName":"SAT"}, {"shortName":"SUN"}]
})