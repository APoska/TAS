angular.module('app')
.controller('LoginCtrl',
  function ($scope, $state, UserService, AuthService) {
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
        .then(function successCallback(response) {
              AuthService.storeUserCredentials(response.data.token);
              $state.go('home');
          }, function errorCallback(response) {
              $scope.error = true;
              $scope.errorMessage = response.data.msg;
          }); 
      }
    };
})