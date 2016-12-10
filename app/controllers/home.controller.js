angular.module('app')
.controller('HomeCtrl', function($scope, AuthService, $state) {

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

  $scope.tasks = function() {
    $state.go('tasks');
  };
	$scope.weekdays=[
  		{"name": "Monday", "shortName":"MON"},
  		{"name": "Tuesday", "shortName":"TUE"},
  		{"name": "Wednesday", "shortName":"WED"},
  		{"name": "Thursday", "shortName":"THU"},
  		{"name": "Friday", "shortName":"FRI"},
  		{"name": "Saturday", "shortName":"SAT"},
  		{"name": "Sunday", "shortName":"SUN"}
  	]

  	
	var firstDay = new Date(2016, 11, 1);
	var daynumb = firstDay.getDay();
	var lastDay = new Date(2016, 12, 0);
	var daycount = lastDay.getDate();
	var days = [];
	if(daynumb===0)
		daynumb=7;
	for(i=1; i<daynumb; i++){
		var foo = new Date(firstDay.getFullYear(), firstDay.getMonth()-1, 8)
		days.push({day: foo});
	}
	for(i=1; i<=daycount; i++){
		var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);
		days.push({day: foo});
	}
	var num = 43-daynumb-daycount;
	for(i=1; i<=num; i++){
		var foo = new Date(firstDay.getFullYear(), firstDay.getMonth(), 9);
		days.push({day: foo});
	}
	$scope.days=days;

  


})