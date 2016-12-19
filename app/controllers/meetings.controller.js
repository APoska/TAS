(function() {

angular.module('app')
	.controller('MeetingCtrl', 
		function($scope, $timeout, MeetingsService, UserService){
			var authToken = window.localStorage.getItem("yourTokenKey");

			UserService.getUserDetails(authToken).then(function(user) {
				MeetingsService.getMeetingDetails(user).then(function(meetings){
					$scope.Meetings = meetings;
				});

				$scope.clearInputMeeting = function() {
					$scope.meetingTitle = null;
					$scope.startDate = null;
					$scope.place = null;
					$scope.description = null;
					$scope.guestsList = null;
				}

				$scope.saveMeeting = function(){
					var date = new Date(($scope.startDate.getTime()-$scope.startDate.getTimezoneOffset()*60000));

					var Meeting = {
						title: $scope.meetingTitle,
						startDate: $scope.startDate.toISOString(),
						place: $scope.place,
						description: $scope.description,
						guestList: $scope.guestsList
					}
					MeetingsService.addMeeting(Meeting, user);
					
					MeetingsService.getMeetingDetails(user).then(function(meetings){
						$scope.Meetings = meetings;
					});
				}

				$scope.saveEditedMeeting = function(){
					var date = new Date(($scope.startDate.getTime()-$scope.startDate.getTimezoneOffset()*60000));

					var Meeting = {
						title: $scope.meetingTitle,
						startDate: $scope.startDate.toISOString(),
						description: $scope.place,
						description: $scope.description,
						guestList: $scope.guestsList
					}
					MeetingsService.editMeeting($scope.meetID, Meeting);
					
					MeetingsService.getMeetingDetails(user).then(function(meetings){
						$scope.Meetings = meetings;
					});
				}

				$scope.editMeeting = function(obj){
					var meetID = obj.target.attributes.data.value
					$scope.meetID = meetID;
					var Meeting = MeetingsService.getMeeting(meetID).then(function(meeting){
						$scope.showModal = true;
						$scope.editButton = true;

						$scope.meetingTitle = meeting.title;
						$scope.startDate = new Date(meeting.startDate);
						$scope.description = meeting.description;
						$scope.guestList = meeting.guests;

					});
				}

				$scope.removeMeeting = function(obj){
					MeetingsService.deleteMeeting(obj.target.attributes.data.value);
					
					var f = function(){
						MeetingsService.getMeetingDetails(user).then(function(meeting){
							$scope.Meetings = meeting;
						});
					}

					$timeout(f, 500);
				}
			});
		});
})();