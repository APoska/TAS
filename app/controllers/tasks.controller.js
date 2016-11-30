(function(){
  angular.module('app')
  .controller('TasksCtrl',
    function($scope, TasksService){
      


      TasksService.getTaskDetails().then(function(tasks){
         $scope.Tasks = tasks;
      });
      
     





  });


})();