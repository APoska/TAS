(function() {

angular.module('app')
	.controller('MeetingCtrl', 
		function($scope, $state, $stateParams, $timeout, MeetingsService, UserService){
			var authToken = window.localStorage.getItem("yourTokenKey");
			var tasksDate = $state.params.date;
			var date=null;
			if(tasksDate != null || tasksDate != undefined){
				var dd = tasksDate.getDate(); var mm = tasksDate.getMonth()+1; var yy = tasksDate.getFullYear();
				if(mm < 10) {mm = '0' + mm;}
				if(dd < 10) {dd = '0' + dd;}
				var date = yy + '-' + mm + '-' + dd;
			}
			var dailyMeets = [];
			var meetingsToAccept = [];

			UserService.getUserDetails(authToken).then(function(user) {
				MeetingsService.getMeetingDetails(user).then(function(meetings){
					
					for(var x in meetings){
						for(var p in meetings[x].guests){
							if(meetings[x].guests[p].login == user.login && (meetings[x].guests[p].flag == "pending")){
								meetingsToAccept.push(meetings[x]);
							}
						}
					}

					$scope.Shared = meetingsToAccept;
					$scope.LoggedIn = user._id;
					
					if(date==null){
						$scope.Meetings = meetings;
						$scope.when = "All Meetings"
					}
					else if(date!=null){
						for(var i in meetings){
							if(meetings[i].startDate == date){
								dailyMeets.push(meetings[i]);
							}
						}
						$scope.when = "Meetings at " + date;
						$scope.Meetings = dailyMeets;
					}
				});

				$scope.clearInputMeeting = function() {
					$scope.meetingTitle = null;
					$scope.date = null;
					$scope.time = null;
					$scope.place = null;
					$scope.status = null;
					$scope.description = null;
					$scope.guestsList = null;
				}

				$scope.meetingStatus = [
    				{ label: 'public'},
    				{ label: 'private'}
  				];

  				$scope.statusFlag = $scope.meetingStatus[0];

				$scope.makeAccepted = function(obj){
					var meetingID = obj.target.attributes.data.value
					MeetingsService.getMeeting(meetingID).then(function(meeting){
						var guestsToEdit = [];
						var Meeting = {};
						for(var x=0; x<meeting.guests.length; x++){
								guestsToEdit.push(meeting.guests[x]);
						}

						for(var z=0; z<guestsToEdit.length; z++){
							if(guestsToEdit[z].id == user._id){
								guestsToEdit[z].flag = "accepted";
							}
						}
						
						meeting.guests = guestsToEdit;

						MeetingsService.editMeeting(meetingID, meeting);

						location.reload();
  					});

  				}
  				$scope.makeRejected = function(obj){
					var meetingID = obj.target.attributes.data.value
					MeetingsService.getMeeting(meetingID).then(function(meeting){
						var guestsToEdit = [];
						var Meeting = {};
						for(var x=0; x<meeting.guests.length; x++){
								guestsToEdit.push(meeting.guests[x]);
						}

						for(var z=0; z<guestsToEdit.length; z++){
							if(guestsToEdit[z].id == user._id){
								guestsToEdit[z].flag = "rejected";
							}
						}
						
						meeting.guests = guestsToEdit;

						MeetingsService.editMeeting(meetingID, meeting);

						location.reload();
  					});

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
						status: ($scope.statusFlag.label).toString(),
						description: $scope.description,
						guestList: {}
					}

					var promise = UserService.getUsersID(loginObj)

					console.log(promise);

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
						status: $scope.statusFlag.label,
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
						$scope.status = meeting.status;
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