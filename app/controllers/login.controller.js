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
        .then(function successCallback(response) {
          $state.go('home');
        }, function errorCallback(response) {
          console.log(response.data.msg);
      });
      }
    };
})