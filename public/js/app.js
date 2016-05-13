angular.module("recordsapp", ["ui.router"])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("clientlist", {
      "url": "/clientlist",
      "templateUrl": "templates/clientlist.html",
      "controller": "MainController",
      "cache": false
    })
    .state('client', {
      'url': '/client/:documentId',
      'templateUrl': 'templates/client.html',
      'controller': 'MainController',
      'cache': false
    });
  $urlRouterProvider.otherwise("clientlist");
})

.controller("MainController", function($scope, $http, $state, $stateParams) {

  $scope.items = {};

  $scope.fetchAll = function() {
    $http({
        method: "GET",
        url: "/api/client/getAll"
      })
      .success(function(result) {
        for (var i = 0; i < result.length; i++) {
          $scope.items[result[i].id] = result[i];
        }
      })
      .error(function(error) {
        console.log(JSON.stringify(error));
      });
  };

  if ($stateParams.documentId) {
    $http({
        method: "GET",
        url: "/api/get",
        params: {
          document_id: $stateParams.documentId
        }
      })
      .success(function(result) {
        $scope.inputForm = result[0];
      })
      .error(function(error) {
        console.log(JSON.stringify(error));
      });
  }

  $scope.delete = function(documentId) {
    $http({
        method: "POST",
        url: "/api/delete",
        data: {
          document_id: documentId
        }
      })
      .success(function(result) {
        delete $scope.items[documentId];
      })
      .error(function(error) {
        console.log(JSON.stringify(error));
      });
  };

  $scope.save = function(firstname, lastname, email, telephone) {
    $http({
        method: "POST",
        url: "/api/client",
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          telephone: telephone,
          document_id: $stateParams.documentId
        }
      })
      .success(function(result) {
        $state.go("clientlist");
      })
      .error(function(error) {
        console.log(JSON.stringify(error));
      });
  };

});
