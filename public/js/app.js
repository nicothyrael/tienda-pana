angular.module('recordsapp', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('list', {
      'url': '/clientlist',
      'templateUrl': 'templates/clientlist.html',
      'controller': 'MainController',
      'cache': false
    })
    .state('item', {
      'url': '/client/:documentId',
      'templateUrl': 'templates/client.html',
      'controller': 'MainController',
      'cache': false
    });
  $urlRouterProvider.otherwise('clientlist');
})

.controller('MainController', function($scope, $http, $state, $stateParams

});
