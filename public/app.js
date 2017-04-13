'use strict';

var app = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/game', {
                templateUrl: 'public/chart/chart.html',
            }).when('/rank', {
                templateUrl: 'public/rank/rank.html',
            }).when('/myBasket', {
                templateUrl: 'public/myBasket/myBasket.html',
            }).otherwise({
            redirectTo: '/game'
        });
        $locationProvider.html5Mode(false);
    }]);

app.controller('AppCtrl',['$scope', '$http',function AppCtrl($scope, $http) {
  let allData = [], result = {};
  $scope.uiConfig = {
    showBasket: false,
    teams: {
      gsw: {
        name: 'Golden State',
        alies: "gsw"
      },
      por: {
        name: 'Portland',
        alies: 'por'
      },
      sas: {
        name: 'San Antonio',
        alies: 'sas'
      },
      mem: {
        name: 'Memphis',
        alies: 'mem'
      },
      hou: {
        name: 'Houston',
        alies: 'hou'
      },
      okc: {
        name:'Oklahoma City',
        alies: 'okc'
      },
      uta: {
        name: 'Utah',
        alies:'uta'
      },
      lac: {
        name: 'Los Angels',
        alies: 'lac'
      },
      clc: {
        name: 'Cleveland',
        alies: 'clc'
      },
      bos: {
        name: 'Boston',
        alies: 'bos'
      },
      tor: {
        name: 'Tronto',
        alies: 'tor'
      },
      was: {
        name: 'Washington',
        alies: 'was'
      },
      mil: {
        name: 'Milwaukee',
        alies: 'mil'
      },
      ind: {
        name: 'Indiana',
        alies: 'ind'
      },
      atl: {
        name: 'Atlanta',
        alies: 'atl'
      },
      chi: {
        name: 'Chicago',
        alies: 'chi'
      }
    }
  };

  $http.get("/api/getAll").then(function(result){
    allData = result.data;
    $scope.allData = allData;
  });


  $scope.setBasket = function(team, round, index){
    $scope.myBasket.basket[round][index] = $scope.uiConfig.teams[team];
  };

  $scope.getMyBasket = function(user) {
    $scope.myBasket = false;
    for (let basket of allData) {
      if (basket.user === user.email){
        $scope.myBasket = basket;
      }
    }

    if(!$scope.myBasket){
      $scope.myBasket = {
        user: user.email,
        name: user.basketName,
        basket: {
          round1:[{},{},{},{}],
          semiConf: [{},{},{},{}],
          conf: [{},{}],
          final: [{}]
        },
        score: {
            round1:[0,0,0,0,0,0,0,0],
            semiConf: [0,0,0,0],
            conf: [0,0],
            final: [0]
        }
      };
      $http.post("/api/newBasket", $scope.myBasket).then(function(res){
          $scope.allData = res;
      });
    }
    $scope.uiConfig.showBasket = true;
  };

  $scope.saveMyBasket = function(){
    $http.post("/api/updateBasket", $scope.myBasket)
  }

  //getData();

}]);
