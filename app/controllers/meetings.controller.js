(function() {

angular.module('app')
	.controller('MeetingCtrl', 
		function($scope, $timeout, MeetingsService, UserService){
			var authToken = window.localStorage.getItem("yourTokenKey");

			UserService.getUserDetails(authToken).then(function(user) {
				MeetingsService.getMeetingDetails(user).then(function(meetings){
					$scope.Meetings = meetings;
					$scope.Guests = meetings[0].guests;
				});

				$scope.clearInputMeeting = function() {
					$scope.meetingTitle = null;
					$scope.date = null;
					$scope.time = null;
					$scope.place = null;
					$scope.description = null;
					$scope.guestsList = null;
				}

				$scope.saveMeeting = function(){
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.time.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.time.getMinutes().toString())).slice(-2);
					var people = $scope.guestsList.replace(/ /g,'').split(',');
					var loginObj = {login : []};

					for(var i=0; i<people.length; i++){
						loginObj.login.push(people[i]);
					}
					
					var Meeting = {
						title: $scope.meetingTitle,
						startDate: date,
						startTime: time,
						place: $scope.place,
						description: $scope.description,
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

						Meeting.guestList = personObj

						MeetingsService.addMeeting(Meeting, user);
				
						MeetingsService.getMeetingDetails(user).then(function(meetings){
							$scope.Meetings = meetings;
							$scope.Guests = meetings[0].guests;
						});
					})
				}

				$scope.saveEditedMeeting = function(){
					var date = $scope.date.getFullYear().toString() + '-' + ('0' + ($scope.date.getMonth()+1).toString()).slice(-2) + '-' + ('0' + ($scope.date.getDate().toString())).slice(-2);
					var time = ('0' + ($scope.date.getHours().toString())).slice(-2) + ':' + ('0' + ($scope.date.getMinutes().toString())).slice(-2);

					var Meeting = {
						title: $scope.meetingTitle,
						startDate: date,
						startTime: time,
						place: $scope.place,
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

						var newDate = new Date(task.startDate);
						var hours = task.startTime.substring(0,2);
						var minutes = task.startTime.slice(-2);

						var newTime = new Date();

						newTime.setHours(hours);
						newTime.setMinutes(minutes);

						$scope.meetingTitle = meeting.title;
						$scope.date = newDate;
						$scope.time = newTime;
						$scope.place = meeting.place;
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