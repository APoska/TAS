angular.module('app')
.controller('HomeCtrl', function($scope, AuthService, $state) {

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

  $scope.tasks = function() {
    $state.go('tasks');
  };
})