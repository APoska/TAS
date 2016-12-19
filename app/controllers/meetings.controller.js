(function() {

angular.module('app')
	.controller('MeetingCtrl', 
		function($scope, MeetingsService, UserService){
			var authToken = window.localStorage.getItem("yourTokenKey");

			UserService.getUserDetails(authToken).then(function(user) {
				MeetingsService.getMeetingDetails(user).then(function(meetings){
					$scope.Meetings = meetings;
				});

			});
		});
})();