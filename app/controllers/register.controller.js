angular.module('app')
.controller('RegisterCtrl',
  function ($scope, $state, AuthService) {
    $scope.user = {
        name: '',
        password: '',
        login: '',
        email: ''
    };

    // initial value
    $scope.error = false;

    $scope.register = function(isValid) {
      if (isValid) {
        // call register from service
        AuthService.register($scope.user)
          .then(function () {
            $state.go('login');
          }, function () {
            $scope.error = true;
            $scope.errorMessage = "User already exist";
          });
      } else {
        alert('One of the fields is novalid!');
      }
    };
})