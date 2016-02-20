(function() {
    'use strict';
    function rozkladCtrl($scope) {
        $scope.choiceView = 'list';
        $scope.changeView = function (value) {
            if (value === 'list') {
                $scope.choiceView = 'icon';
            } else if (value === 'icon') {
                $scope.choiceView = 'list';
            }
        };
    }
    function loginCtrl($scope) {
    }
    function getTransportsCtrl($scope, $http) {
        $scope.trams = [];
        $scope.trolleybuses = [];
        $scope.buses = [];
        $http.get('http://localhost:3001/transports')
            .success(function(data) {
                $scope.data = data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type == 'tram') {
                        $scope.trams.push(data[i]);
                    } else if (data[i].type == 'trolleybus') {
                        $scope.trolleybuses.push(data[i]);
                    } else if (data[i].type == 'bus') {
                        $scope.buses.push(data[i]);
                    }
                }
            })
            .error(function(err) {
                console.error('error: ', err);
            });
    }
    function getRoutesCtrl($scope,  $rootScope, $http) {

        //$scope.choiceDetail = 'list';
        //var chackWatch;
        $scope.getRoute = function(query) {
            $rootScope.indexNumber = 0;
            $rootScope.route = query;
            var urlQuery = 'http://localhost:3001/route?direction=' + query.file;
            if ($scope.routeCheck == query.file) {
                console.log('Data already loaded.');
            } else {
                console.log('Loading.');
                $http.get(urlQuery)
                    .success(function(data) {
                        //if (chackWatch) chackWatch();
                        $scope.checkNumber = $rootScope.route.number;
                        $scope.checkType = $rootScope.route.type;
                        //if ($scope.chackWatch && ($scope.chackWatch != query)) listen();
                        //chackWatch = $scope.$watch('choiceDetail', function(newValue, oldValue) {
                            //if (newValue === 'map') {
                        $rootScope.$broadcast('isLoadToDir', {stations: data});
                            //} else if (newValue === 'list') {
                        $rootScope.$broadcast('isLoadToCtr', {stations: data});
                            //}
                            //$scope.chackWatch = query;
                        //});
                        //$scope.$watch('route', function(newValue, oldValue) {listen()});
                        //listen();
                    })
                    .error(function(error) {
                        console.error('error: ', error);
                    });
            }
            $scope.routeCheck = query.file;
        };

    }
    function rozkladStationsCtrl($scope, $rootScope) {
        var indexNumber = 0, quantityStations, data;
        $scope.$on('isLoadToCtr', function(event, args) {
            console.log('isLoadToCtr');
            data = args.stations;
            $scope.choiceDescription = 'list';
            $scope.routeName = $rootScope.route.name;
            $scope.routeNumber = $rootScope.route.number;
            $scope.checkType = $rootScope.route.type;
            $scope.addRoutList($rootScope.indexNumber);
        });
        $scope.addRoutList = function(index) {
            var time = 0;
            var stations = [];
            indexNumber = index;
            $scope.responseData = data[indexNumber];
            $rootScope.indexNumber = index;
            quantityStations = data.length;
            for (var i = 0; i < quantityStations; i++) {
                var station = {};
                if (index < i){
                    time += data[i].toStation;
                    station.toStation = time + "'";
                } else if (index > i) {
                    station.toStation = '';
                } else if (index == i) {
                    station.toStation = 0;
                    setDepot(data[i-1], data[i], data[i+1]);
                }
                station.name = data[i].name;
                stations.push(station);
            }
            $scope.stations = stations;
        };
        //$scope.$on('$destroy', function() {
        //listen();
        //});
        var setDepot = function(before, data, after) {
            $scope.stationName = data.name;
            $scope.weekdays = data.weekdays;
            $scope.weekend = data.weekend;
            if (!before) {
                $scope.previousStation = 'start';
                $scope.nextStation = after.toStation + "'";
            } else if (!after){
                $scope.nextStation = 'end';
                $scope.previousStation = data.toStation + "'";
            } else {
                $scope.nextStation = after.toStation + "'";
                $scope.previousStation = data.toStation + "'";
            }
        };
        $scope.getPreStation = function() {
            if (indexNumber > 0) {
                indexNumber -= 1;
                $scope.responseData = data[indexNumber];
                $scope.addRoutList(indexNumber);
            }
        };
        $scope.getNextStation = function() {
            if (indexNumber < quantityStations - 1) {
                indexNumber += 1;
                $scope.responseData = data[indexNumber];
                $scope.addRoutList(indexNumber);
            }
        }
    }
    angular.module('rozkladApp')
        .controller('RozkladCtrl', ['$scope', rozkladCtrl])
        .controller('LoginCtrl', ['$scope', loginCtrl])
        .controller('GetTransportsCtrl', ['$scope', '$http', getTransportsCtrl])
        .controller('GetRoutesCtrl', ['$scope', '$rootScope', '$http', getRoutesCtrl])
        .controller('RozkladStationsCtrl', ['$scope', '$rootScope', rozkladStationsCtrl])
})();