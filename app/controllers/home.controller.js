angular.module('app')
.controller('HomeCtrl', function($scope, AuthService, $state) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})

.controller('monthCalCtrl', function($scope){
	var firstDay = new Date(2016, 11, 1);
	var daynumb = firstDay.getDay();
	var lastDay = new Date(2016, 12, 0);
	var daycount = lastDay.getDate();
	for(i=1; i<=daycount; i++){
		var count = i+daynumb-1;
		var c = count.toString();
		var x = 'date'+c;
		var day = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);
		console.log(x);
		$scope.x = day;
	}
})