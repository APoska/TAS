angular.module('app').factory('AuthService',
  function ($q, $http) {

    // create user variable
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
  	var isAuthenticated = false;
 	  var authToken;

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
    	$http.defaults.headers.common.Authorization = undefined;
    	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  	}

	  var login = function(user) {
      return $q(function(resolve, reject) {
        $http.post('/api/auth', user).then(function(result) {
          if (result.data.success) {
            storeUserCredentials(result.data.token);
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    }

	  var register = function(user) {
      return $q(function(resolve, reject) {
        $http.post('/api/users', user).then(function(result) {
          if (result.data.success) {
            resolve(result.data.msg);
          } else {
            reject(result.data.msg);
          }
        });
      });
    }

    var logout = function() {
      destroyUserCredentials();
    };

    // return available functions for use in the controllers
    return ({
      login: login,
      register: register,
      logout: logout
    });
});