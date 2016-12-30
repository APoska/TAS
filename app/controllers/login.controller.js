angular.module('app')
.controller('LoginCtrl',
  function ($scope, $state, UserService) {
    $scope.user = {
        password: '',
        login: '',
    };
    // initial value
    $scope.error = false;
    $scope.login = function (isValid) {
      if (isValid) {
        // call login from service
        UserService.login($scope.user)
        .then(function(response) {
          $state.go('home');
        }, function(error) {
          console.log('3');
        });
      }
    };
})