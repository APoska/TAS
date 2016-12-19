angular.module('app').factory('AuthService',
  function ($q, $http) {

    // create user variable
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
  	var isAuthenticated = false;
 	  var authToken;

    function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        useCredentials(token);
      }
    }

  	function storeUserCredentials(token) {
    	window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    	useCredentials(token);
  	}
 
  	function useCredentials(token) {
    	isAuthenticated = true;
    	authToken = token;
    	// Set the token as header for your requests!
    	$http.defaults.headers.common.Authorization = authToken;
  	}

  	function destroyUserCredentials() {
  		authToken = undefined;
      isAuthenticated = false;
    	$http.defaults.headers.common.Authorization = undefined;
    	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  	}

	  var login = function(user) {
      // send a post request to the serve
      return $http.post('/api/auth', user)
        // handle success or error
        .then(function successCallback(response) {
          storeUserCredentials(response.data.token);
      }, function errorCallback(response) {
          console.log(response.data.msg);
      });    
    };

	  var register = function(user) {
      // send a post request to the server
      return $http.post('/api/users', user)
        // handle success or error
        .then(function successCallback(response) {
          console.log(response.data.msg);
      }, function errorCallback(response) {
          console.log(response.data.msg);
      }); 
    };

    var logout = function() {
      destroyUserCredentials();
    };

    var isAuth = function() {
      return isAuthenticated;
    }

    loadUserCredentials();

    // return available functions for use in the controllers
    return ({
      login: login,
      register: register,
      logout: logout,
      isAuth: isAuth,
    });
});