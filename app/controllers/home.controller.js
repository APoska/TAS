angular.module('app')
.controller('HomeCtrl', function($scope, UserService, $state) {

	$scope.logout = function() {
		UserService.logout();
		$state.go('login');
	};

	$scope.tasks = function() {
		$state.go('tasks');
	};

	$scope.meetings = function() {
		$state.go('meetings');
	};

	var date = new Date();
	var yy = date.getFullYear(); var mm = date.getMonth(); var dd = date.getDate(); var currentMonth = mm; var currentYear = yy;

	var months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

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
		for(i=1; i<daynumb; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth()-1, 8); prevMonthDays.push({day: foo});
		}
		for(i=1; i<=daycount; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);	days.push({day: foo});
			if(i==dd && mm == currentMonth && yy == currentYear){
				days[days.length-1].today = true;
			}
			else{
				days[days.length-1].today = false;
			}
		}
		console.log(days);
		$scope.prevMonthDays = prevMonthDays;
		$scope.days=days;
	};

	$scope.nextMonth = function() {
		mm++;
		if(mm===12){
			mm=0; yy++;
		}
		days=[];prevMonthDays=[];
				generateCalendar();
		currentDate = months[mm] + '\n' + yy; $scope.month = currentDate;
	};

	$scope.prevMonth = function() {
		mm--;
		if(mm===-1){
			mm=11; yy--;
		}
		days = [];prevMonthDays=[];
		generateCalendar();
		currentDate = months[mm] + '\n' + yy; $scope.month = currentDate;
	};
	generateCalendar();
	
	currentDate = months[mm] + '\n' + yy;
	$scope.month = currentDate;

	$scope.weekdays=[
  		{"name": "Monday", "shortName":"MON"}, {"name": "Tuesday", "shortName":"TUE"}, {"name": "Wednesday", "shortName":"WED"},
  		{"name": "Thursday", "shortName":"THU"}, {"name": "Friday", "shortName":"FRI"}, {"name": "Saturday", "shortName":"SAT"},
  		{"name": "Sunday", "shortName":"SUN"}
  	]
})