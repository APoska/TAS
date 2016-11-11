angular.module('app')
 
.controller('LoginCtrl',
  function ($scope, $state, AuthService) {
    $scope.user = {
        password: '',
        login: '',
    };

    $scope.login = function (isValid) {
      if (isValid) {
        // call login from service
        AuthService.login($scope.user)
        // handle success
        .then(function () {
          $state.go('home');
        })
          // handle error
        .catch(function () {
          alert('Not Good');
        });
      }
    };
})
 
.controller('RegisterCtrl',
  function ($scope, $state, AuthService) {
    $scope.user = {
        name: '',
        password: '',
        login: '',
        email: ''
    };

    $scope.register = function(isValid) {
      if (isValid) {
        // call register from service
        AuthService.register($scope.user)
          // handle success
          .then(function () {
            $state.go('login');
          })
          // handle error
          .catch(function () {
            alert('Not Good');
          });
      } else {
        alert('One of the fields is novalid!')
      }
    };
})

.controller('HomeCtrl', function($scope, AuthService, $state) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };
})