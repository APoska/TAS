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

    var isAuth = function() {
      return isAuthenticated;
    }

    loadUserCredentials();

    // return available functions for use in the controllers
    return ({
      destroyUserCredentials: destroyUserCredentials,
      isAuth: isAuth,
      storeUserCredentials: storeUserCredentials,
    });
});