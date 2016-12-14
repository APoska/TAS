angular.module('app')
.controller('HomeCtrl', function($scope, AuthService, $state) {

	$scope.logout = function() {
		AuthService.logout();
		$state.go('login');
	};

	$scope.tasks = function() {
		$state.go('tasks');
	};

	var date = new Date();
	var yy = date.getFullYear();var mm = date.getMonth();var dd = date.getDate();

	var months = [];
	months[0] = "Styczeń";
	months[1] = "Luty";
	months[2] = "Marzec";
	months[3] = "Kwiecień";
	months[4] = "Maj";
	months[5] = "Czerwiec";
	months[6] = "Lipiec";
	months[7] = "Sierpień";
	months[8] = "Wrzesień";
	months[9] = "Październik";
	months[10] = "Listopad";
	months[11] = "Grudzień";


	var firstDay = new Date(yy, mm, 1);
	var daynumb = firstDay.getDay();
	var lastDay = new Date(yy, mm+1, 0);
	var daycount = lastDay.getDate();
	var days = [];

	function generateCalendar(){
		var firstDay = new Date(yy, mm, 1);
		var daynumb = firstDay.getDay();
		var lastDay = new Date(yy, mm+1, 0);
		var daycount = lastDay.getDate();
		if(daynumb===0)
			daynumb=7;
		for(i=1; i<daynumb; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth()-1, 8); days.push({day: foo});
		}
		for(i=1; i<=daycount; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);	days.push({day: foo});
		}
		var num = 43-daynumb-daycount;
		if(num >= 7) num = num - 7;
		
		for(i=1; i<=num; i++){
			var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);	days.push({day: foo});
		}
		$scope.days=days;
	};

	$scope.nextMonth = function() {
		mm++;
		if(mm===12){
			mm=0; yy++;
		}
		days=[];
		generateCalendar();
		currentDate = months[mm] + '\n' + yy;$scope.month = currentDate;
	};

	$scope.prevMonth = function() {
		mm--;
		if(mm===-1){
			mm=11; yy--;
		}
		days = [];
		generateCalendar();
		currentDate = months[mm] + '\n' + yy;$scope.month = currentDate;
	};
	generateCalendar();
	
	currentDate = months[mm] + '\n' + yy;
	$scope.month = currentDate;

	$scope.weekdays=[
  		{"name": "Monday", "shortName":"MON"},
  		{"name": "Tuesday", "shortName":"TUE"},
  		{"name": "Wednesday", "shortName":"WED"},
  		{"name": "Thursday", "shortName":"THU"},
  		{"name": "Friday", "shortName":"FRI"},
  		{"name": "Saturday", "shortName":"SAT"},
  		{"name": "Sunday", "shortName":"SUN"}
  	]
})