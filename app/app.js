angular.module('app', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'public/views/login.html',
      controller: 'LoginCtrl',
    })
    .state('home', {
      url: "/home",
      templateUrl: 'public/views/home.html',
      controller: 'HomeCtrl',
    })
    .state('register', {
      url: "/register",
      templateUrl: 'public/views/register.html',
      controller: 'RegisterCtrl',
    })
    .state('tasks', {
      url: "/tasks",
      templateUrl: "public/views/tasks.html",
      controller: 'TasksCtrl',
    })
    $urlRouterProvider.otherwise('/login');
})

.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService){
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
    console.log(AuthService.isAuth());
    if (!AuthService.isAuth()) {
      if (next.name !== 'login' && next.name !== 'register' && next.name !== 'tasks') {
        event.preventDefault();
        $state.go('login');
      }
    }
    /*if(isLogged && toState.name === 'login'){
      event.preventDefault();
      // Redirect to the homepage if the page is the login and
      // you are already logged in
      $state.go('home');

    }*/
  });
}]);
