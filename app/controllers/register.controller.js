angular.module('app')
.controller('RegisterCtrl',
  function ($scope, $state, UserService) {
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
        UserService.register($scope.user)
          .then(function successCallback(response) {
              console.log(response.data.msg);
              $state.go('login');
          }, function errorCallback(response) {
              $scope.error = true;
              $scope.errorMessage = response.data.msg;
          }); 
      } else {
        alert('One of the fields is novalid!');
      }
    };
})