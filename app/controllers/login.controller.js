angular.module('app')
.controller('LoginCtrl',
  function ($scope, $state, AuthService) {
    $scope.user = {
        password: '',
        login: '',
    };

    // initial value
    $scope.error = false;

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
          $scope.error = true;
          $scope.errorMessage = "Invalid username/password";
        });
      }
    };
})