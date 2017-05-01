'use strict';

var app = angular.module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
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

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', function AppCtrl($scope, $http, $mdDialog) {
    let allData = [], result = {}, viewBracket, getScore, setResult;
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
                name: 'Oklahoma City',
                alies: 'okc'
            },
            uta: {
                name: 'Utah',
                alies: 'uta'
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

    $http.get("/api/getAll").then(function (result) {
        allData = result.data;
        $scope.allData = allData;
        setResult();
        for (let i = 0; i < $scope.allData.length; i++) {
            $scope.allData[i].finalScore = getScore($scope.allData[i]);
        }
    });

    setResult = function () {
        for (let data of $scope.allData) {
            if (data.basketName === 'result') {
                result = data;
            }
        }
    };

    getScore = function (braket) {
        let score = 0;
        //calculate round 1
        for (let i = 0; i < 8; i++) {
            if (braket.basket.round1[i].alies === result.basket.round1[i].alies) {
                score += 10;
                if (braket.score.round1[i] === result.score.round1[i]) {
                    score += 5;
                }
            }
        }
        //calculate round 2
        for (let i = 0; i < 4; i++) {
            if (angular.equals(braket.basket.semiConf[i], result.basket.semiConf[i])) {
                score += 20;
                if (braket.score.semiConf[i] === result.score.semiConf[i]
                    && angular.equals(braket.basket.round1[2 * i], result.basket.round1[2 * i])
                    && angular.equals(braket.basket.round1[2 * i + 1], result.basket.round1[2 * i + 1])) {
                    score += 10;
                }
            }
        }
        //calculate round 3
        for (let i = 0; i < 2; i++) {
            if (angular.equals(braket.basket.conf[i], result.basket.conf[i])) {
                score += 40;
                if (braket.score.conf[i] === result.score.conf[i]
                    && angular.equals(braket.basket.semiConf[2 * i], result.basket.semiConf[2 * i])
                    && angular.equals(braket.basket.semiConf[2 * i + 1], result.basket.semiConf[2 * i + 1])) {
                    score += 20;
                }
            }
        }
        //calculate final score
        if (angular.equals(braket.basket.final[0], result.basket.final[0])) {
            score += 80;
            if (braket.score.final[0] === result.basket.final[0]
                && angular.equals(braket.basket.conf[0], result.basket.conf[0])
                && angular.equals(braket.basket.conf[1], result.basket.conf[1])) {
                score += 40;
            }
        }

        //console.log(score);
        return score;
    };

    $scope.setBasket = function (team, round, index) {
        $scope.myBasket.basket[round][index] = $scope.uiConfig.teams[team];
    };

    $scope.getMyBasket = function (user) {
        $scope.myBasket = false;
        for (let basket of allData) {
            if (basket.user === user.email) {
                $scope.myBasket = basket;
            }
        }

        if (!$scope.myBasket) {
            $scope.myBasket = {
                user: user.email,
                name: user.basketName,
                basket: {
                    round1: [{}, {}, {}, {}],
                    semiConf: [{}, {}, {}, {}],
                    conf: [{}, {}],
                    final: [{}]
                },
                score: {
                    round1: [0, 0, 0, 0, 0, 0, 0, 0],
                    semiConf: [0, 0, 0, 0],
                    conf: [0, 0],
                    final: [0]
                }
            };
            $http.post("/api/newBasket", $scope.myBasket).then(function (res) {
                $scope.allData = res;
            });
        }
        $scope.uiConfig.showBasket = true;
    };

    $scope.saveMyBasket = function () {
        $http.post("/api/updateBasket", $scope.myBasket)
    };

    $scope.showBracket = function (bracket) {
        viewBracket = bracket;
        $mdDialog.show({
            templateUrl: '/public/chart/viewBracket.html',
            controller: DialogController,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        });
    };

    function DialogController($scope, $mdDialog) {
        $scope.currentBracket = viewBracket;
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    }

    //getData();

}]);
