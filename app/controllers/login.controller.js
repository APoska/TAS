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
        .then(function success(response) {
          $state.go('home');
        })

        .catch(function error(response) {
          console.log('3');
        });
      }
    };
})