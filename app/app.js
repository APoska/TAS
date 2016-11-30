angular.module('app', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: 'public/views/login.html',
      controller: 'LoginCtrl',
      access: {restricted: false}
    })
    .state('home', {
      url: "/home",
      templateUrl: 'public/views/home.html',
      controller: 'HomeCtrl',
      access: {restricted: true}
    })
    .state('register', {
      url: "/register",
      templateUrl: 'public/views/register.html',
      controller: 'RegisterCtrl',
      access: {restricted: false}
    })
    $urlRouterProvider.otherwise('/login');
})

/*
.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'login' && next.name !== 'register') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
});
*/