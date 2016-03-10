(function() {
    'use strict';
    function rozkladCtrl($scope) {

        //
        //myname = "global";
        //function func() {
        //    console.log(myname);
        //    var myname = "local";
        //    console.log(myname);
        //}
        //func();
//var a;
//        //var b = a || 1;
//        var b = a ? a : 1;
//        console.log(b);




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
                //console.log(data);
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

        //var routeCheck;
        $scope.getRoute = function(query) {
            //console.log('query.id - ', query);
            $rootScope.indexNumber = 0;
            $rootScope.route = query;
            console.log('query.', query);
            getRouteData(query.id);
        };
        $scope.getReturnRoute = function() {
            var returnRouteId = $scope.route.return_route_id;
            console.log('returnRouteId - ', returnRouteId);
            getRouteData(returnRouteId);
            //$rootScope.indexNumber = 0;
            //$rootScope.route = query;
            //console.log('query.', query);
            //var urlQuery = 'http://localhost:3001/route?route_id=' + query.id;
            ////if (routeCheck == query.file) {
            ////    console.log('Data already loaded.');
            ////} else {
            ////    console.log('Loading.');
            //$http.get(urlQuery)
            //    .success(function(data) {
            //        var stations = data.stationsOnRoute;
            //        var startTime = data.startTime;
            //        var neighbors = data.neighborStations;
            //        //$scope.stations = stations;
            //        //console.log('data - ', data);
            //        stations[0].timeToStation = 0;
            //        for (var i = 0; i < stations.length - 1; i++) {
            //            for (var j = 0; j < neighbors.length; j++) {
            //                if ((stations[i].stations_id == neighbors[j].station_id) &&
            //                    (stations[i+1].stations_id == neighbors[j].neighbor_station_id) &&
            //                    (neighbors[j].drive_time > 0)) {
            //                    stations[i+1].timeToStation = neighbors[j].drive_time;
            //                }
            //            }
            //        }
            //        //console.log('stations - ', stations);
            //
            //        //$rootScope.$broadcast('isLoadToDir', {stations: data});
            //        $rootScope.$broadcast('isLoadToCtr', {stations: stations, startTime: startTime});
            //    })
            //    .error(function(error) {
            //        console.error('error: ', error);
            //    });
            //}
            //routeCheck = query.file;
        };
        function getRouteData(id) {
            var urlQuery = 'http://localhost:3001/route?route_id=' + id;
            //if (routeCheck == query.file) {
            //    console.log('Data already loaded.');
            //} else {
            //    console.log('Loading.');
            $http.get(urlQuery)
                .success(function(data) {
                    var stations = data.stationsOnRoute;
                    var startTime = data.startTime;
                    var neighbors = data.neighborStations;
                    //$scope.stations = stations;
                    //console.log('data - ', data);
                    stations[0].timeToStation = 0;
                    for (var i = 0; i < stations.length - 1; i++) {
                        for (var j = 0; j < neighbors.length; j++) {
                            if ((stations[i].stations_id == neighbors[j].station_id) &&
                                (stations[i+1].stations_id == neighbors[j].neighbor_station_id) &&
                                (neighbors[j].drive_time > 0)) {
                                stations[i+1].timeToStation = neighbors[j].drive_time;
                            }
                        }
                    }
                    //console.log('stations - ', stations);

                    //$rootScope.$broadcast('isLoadToDir', {stations: data});
                    $rootScope.$broadcast('isLoadToCtr', {stations: stations, startTime: startTime});
                })
                .error(function(error) {
                    console.error('error: ', error);
                });
            //}
            //routeCheck = query.file;
        }

    }
    function rozkladStationsCtrl($scope, $rootScope) {
        var indexNumber = 0, quantityStations, data;
        $scope.$on('isLoadToCtr', function(event, args) {
            console.log('isLoadToCtr');
            data = args.stations;
            //console.log('data', data);
            //$scope.choiceDescription = 'list';
            //$scope.routeName = $rootScope.route.name;
            //$scope.routeNumber = $rootScope.route.number;
            //$scope.checkType = $rootScope.route.type;



            //$rootScope.timeToEnd = {};
            var time = 0;
            var stations = [];
            //indexNumber = 0;
            //$scope.responseData = data[indexNumber];
            //$rootScope.indexNumber = index;
            quantityStations = data.length;
            for (var i = 0; i < quantityStations; i++) {
                var station = {};
                if (i == 0) {
                    station.timeToStation = 0;
                    setDepot(data[i-1], data[i], data[i+1]);
                } else {
                    time += data[i].timeToStation;
                    station.timeToStation = time + "'";
                //} else if (0 > i) {
                //    station.timeToStation = '';
                }

                station.name = data[i].name;
                stations.push(station);
            }
            //$rootScope.timeToEnd = {};
            $rootScope.timeToEnd = stations;
            //console.log('$rootScope.timeToEnd', $rootScope.timeToEnd);

            //$rootScope.addRoutList($rootScope.indexNumber);
            //console.log('$rootScope.indexNumber', $rootScope.indexNumber);
        });
        $rootScope.addRoutList = function(index) {
            //$rootScope.timeToEnd = {};
            var time = 0;
            //var stations = [];
            indexNumber = index;
            //$scope.responseData = data[indexNumber];
            //$rootScope.indexNumber = index;
            //quantityStations = data.length;
            for (var i = 0; i < quantityStations; i++) {
                //var station = {};
                if (index < i){
                    time += data[i].timeToStation;
                    $rootScope.timeToEnd[i].timeToStation = time + "'";
                } else if (index > i) {
                    $rootScope.timeToEnd[i].timeToStation = '';
                } else if (index == i) {
                    $rootScope.timeToEnd[i].timeToStation = 0;
                    setDepot(data[i-1], data[i], data[i+1]);
                }
                //station.name = data[i].name;
                //stations.push(station);
            }
            //$rootScope.timeToEnd = {};
            //$rootScope.timeToEnd = stations;
            //console.log('$rootScope.timeToEnd', $rootScope.timeToEnd);
        };
        //$scope.$on('$destroy', function() {
        //listen();
        //});
        var setDepot = function(before, data, after) {
            $scope.stationName = data.name;
            //$scope.weekdays = data.weekdays;
            //$scope.weekend = data.weekend;
            if (!before) {
                $scope.toPreviousStation = 'start';
                $scope.toNextStation = after.timeToStation + "'";
            } else if (!after){
                $scope.toNextStation = 'end';
                $scope.toPreviousStation = data.timeToStation + "'";
            } else {
                $scope.toNextStation = after.timeToStation + "'";
                $scope.toPreviousStation = data.timeToStation + "'";
            }
        };
        $scope.getPreStation = function() {
            if (indexNumber > 0) {
                indexNumber -= 1;
                //$scope.responseData = data[indexNumber];
                $scope.addRoutList(indexNumber);
            }
        };
        $scope.getNextStation = function() {
            if (indexNumber < quantityStations - 1) {
                indexNumber += 1;
                //$scope.responseData = data[indexNumber];
                $scope.addRoutList(indexNumber);
            }
        }
    }
    //function rozkladStationsCtrl($scope, $rootScope) {
    //    var indexNumber = 0, quantityStations, data;
    //    $scope.$on('isLoadToCtr', function(event, args) {
    //        console.log('isLoadToCtr');
    //        data = args.stations;
    //        $scope.choiceDescription = 'list';
    //        $scope.routeName = $rootScope.route.name;
    //        $scope.routeNumber = $rootScope.route.number;
    //        $scope.checkType = $rootScope.route.type;
    //        //$scope.addRoutList($rootScope.indexNumber);
    //    });
    //    $rootScope.addRoutList = function(index) {
    //        console.log(index);
    //        var time = 0;
    //        var stations = [];
    //        indexNumber = index;
    //        $scope.responseData = data[indexNumber];
    //        $rootScope.indexNumber = index;
    //        quantityStations = data.length;
    //        for (var i = 0; i < quantityStations; i++) {
    //            var station = {};
    //            if (index < i){
    //                time += data[i].toStation;
    //                station.toStation = time + "'";
    //            } else if (index > i) {
    //                station.toStation = '';
    //            } else if (index == i) {
    //                station.toStation = 0;
    //                setDepot(data[i-1], data[i], data[i+1]);
    //            }
    //            station.name = data[i].name;
    //            stations.push(station);
    //        }
    //        $rootScope.stations = stations;
    //    };
    //    //$scope.$on('$destroy', function() {
    //    //listen();
    //    //});
    //    var setDepot = function(before, data, after) {
    //        $scope.stationName = data.name;
    //        $scope.weekdays = data.weekdays;
    //        $scope.weekend = data.weekend;
    //        if (!before) {
    //            $scope.previousStation = 'start';
    //            $scope.nextStation = after.toStation + "'";
    //        } else if (!after){
    //            $scope.nextStation = 'end';
    //            $scope.previousStation = data.toStation + "'";
    //        } else {
    //            $scope.nextStation = after.toStation + "'";
    //            $scope.previousStation = data.toStation + "'";
    //        }
    //    };
    //    $scope.getPreStation = function() {
    //        if (indexNumber > 0) {
    //            indexNumber -= 1;
    //            $scope.responseData = data[indexNumber];
    //            $scope.addRoutList(indexNumber);
    //        }
    //    };
    //    $scope.getNextStation = function() {
    //        if (indexNumber < quantityStations - 1) {
    //            indexNumber += 1;
    //            $scope.responseData = data[indexNumber];
    //            $scope.addRoutList(indexNumber);
    //        }
    //    }
    //}
    angular.module('rozkladApp')
        .controller('RozkladCtrl', ['$scope', rozkladCtrl])
        .controller('LoginCtrl', ['$scope', loginCtrl])
        .controller('GetTransportsCtrl', ['$scope', '$http', getTransportsCtrl])
        .controller('GetRoutesCtrl', ['$scope', '$rootScope', '$http', getRoutesCtrl])
        .controller('RozkladStationsCtrl', ['$scope', '$rootScope', rozkladStationsCtrl])
})();