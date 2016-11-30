angular.module('app').factory('AuthService',
  function ($q, $http) {

    // create user variable
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
  	var isAuthenticated = false;
 	  var authToken;
    var user = false;

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
    	$http.defaults.headers.common.Authorization = undefined;
    	window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  	}

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

	  var login = function(user) {
      // create a new instance of deferred
      var deferred = $q.defer();

      $http.post('/api/auth', user)
        // handle success
        .success(function (response) {

          if(response.success){
            storeUserCredentials(response.token);
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (response) {
            user = false;
            console.log(response.msg);
            deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }

	  var register = function(user) {
      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/users', user)
        // handle success
        .success(function (response) {
          if(response.success){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            console.log(response.msg);
            deferred.reject();
          }
        })
        // handle error
        .error(function (response) {
          user = false;
          console.log(response.msg);
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }

    var logout = function() {
      destroyUserCredentials();
      user = false;
    };

    loadUserCredentials();

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      register: register,
      logout: logout
    });
});