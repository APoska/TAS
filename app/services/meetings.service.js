(function(){

angular.module('app')
	.service('MeetingsService', 
		function($q, $http){		
			this.getMeetingDetails = function(user) {
				return $http({
					method: "GET",
					url : "/api/meetings?user=" + user._id,
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
					url : "/api/meetings/",
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: JSON.stringify({
						title: meeting.title,
						startDate: meeting.startDate,
						place: meeting.place,
						description: meeting.description,
						user: meetCreator._id,
						guests: meeting.guestsList,
					})
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}

			this.editMeeting = function(meetID, meeting) {
				return $http({
					method: "PATCH",
					url : "/api/meetings/" + meetID,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
					data: JSON.stringify({
						title: meeting.title,
						startDate: meeting.startDate, 
						place: meeting.place,
						description: meeting.description,
						guests: meeting.guestsList,
					})
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}

			this.deleteMeeting = function(meetID) {
				return $http({
					method: "DELETE",
					url : "/api/meetings/" + meetID,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.then(function(response){
					return response.data;
				}, function(response){
					return response.err;
				});
			}
		});
})();