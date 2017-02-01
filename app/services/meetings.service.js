(function(){

angular.module('app')
	.service('MeetingsService', 
		function($q, $http){
			this.getAllMeetings = function() {
				return $http({
					method: "GET",
					url : "/api/meetings/",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)

				}).then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}

			this.getMeetingDetails = function(user) {
				return $http({
					method: "GET",
					url : "/api/meetings?user="+user._id,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}

			this.getMeeting = function(meetID) {
				return $http({
					method: "GET",
					url : "/api/meetings/" + meetID,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}

			this.addMeeting = function(meeting, meetCreator) {
				return $http({
					method: "POST",
					url : "/api/meetings",
					headers: {'Content-Type': 'application/json'},
					data: JSON.stringify({
						title: meeting.title,
						startDate:  meeting.startDate,
						startTime: meeting.startTime,
						place: meeting.place,
						status: meeting.status,
						description: meeting.description,
						user: meetCreator._id,
						guests: meeting.guestList
					})
				})
				.then(function(response){
					return response;
				}, function(response){
					return response.err;
				});
			}

			this.editMeeting = function(meetID, meeting) {
				return $http({
					method: "PATCH",
					url : "/api/meetings/" + meetID,
					headers: {'Content-Type': 'application/json'},
					data: JSON.stringify({
						title: meeting.title,
						startDate:  meeting.startDate,
						startTime: meeting.startTime, 
						place: meeting.place,
						description: meeting.description,
						guests: meeting.guests
					})
				})
				.then(function(response){
					return response;
				}, function(response){
					return response.err;
				});
			}

			this.deleteMeeting = function(meetID) {
				return $http({
					method: "DELETE",
					url : "/api/meetings/" + meetID,
					headers: {'Content-Type': 'application/json'}
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}
		});
})();