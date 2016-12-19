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
    .state('meetings', {
      url: "/meetings",
      templateUrl: "public/views/meetings.html",
      controller: 'MeetingCtrl',
    })
    $urlRouterProvider.otherwise('/login');
})

.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService){
  $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
    var isLogged = localStorage.getItem('yourTokenKey');
    if (!AuthService.isAuth()) {
      if (next.name !== 'login' && next.name !== 'register') {
        event.preventDefault();
        $state.go('login');
      }
    }
    if(isLogged && next.name === 'login'){
      event.preventDefault();
      $state.go('home');
    }
  });
}]);
