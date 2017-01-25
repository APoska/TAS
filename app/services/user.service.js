(function(){

angular.module('app')
	.service('UserService', 
		function($q, $http, AuthService){

    this.getUsersID = function(loginObj){
       return $http({
          method: "GET",
          url: "/api/users",
          params: loginObj,
          headers: {'Content-Type' : 'application/json'}
        }).then(function(response){
          return response.data;
        })                
    } 

		this.getUserDetails = function(authToken){
			return $http({
				method: "GET",
				url : "/api/check-user-authorization",
				headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : authToken}  // set the headers so angular passing info as form data (not request payload)

			}).then(function(response){
				return response.data;
			}, function(response){
				return response.err;
			});
		}
    this.getUsers = function(){
      return $http({
        method: "GET",
        url: "/api/users",
        headers: {'Content-Type': 'application/json'}
      }).then(function(response){
        return response.data;
      }, function(response){
        return response.err;
      });
    }    
		this.login = function(user) {
      	// send a post request to the serve
      	return $http.post('/api/authorize-user', user);
    }		
		this.register = function(user) {
      	// send a post request to the server
      	return $http.post('/api/users', user);
    }

    this.logout = function() {
      	AuthService.destroyUserCredentials();
    }

	});
})();
