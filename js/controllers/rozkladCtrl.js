(function() {
    'use strict';
    function rozkladCtrl($scope) {
        $scope.choiceView = 'icon';
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
        //$scope.choiceView = 'list';
        //
        //$scope.tramsShow = true;
        //$scope.trolleybusesShow = false;
        //$scope.busesShow = false;
        //
        //$scope.showTransports = function (transport) {
        //    switch (transport) {
        //        case 'tram':
        //            $scope.tramsShow = !$scope.tramsShow;
        //            $scope.trolleybusesShow = false;
        //            $scope.busesShow = false;
        //            break;
        //        case 'trolleybus':
        //            $scope.tramsShow = false;
        //            $scope.trolleybusesShow = !$scope.trolleybusesShow;
        //            $scope.busesShow = false;
        //            break;
        //        case 'bus':
        //            $scope.tramsShow = false;
        //            $scope.trolleybusesShow = false;
        //            $scope.busesShow = !$scope.busesShow;
        //            break;
        //        default:
        //            console.error(transport + ' is not find.');
        //    }
        //};

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
        //$scope.$on('isLoadToCtr', function(event, args) {
        //$scope.$watch('choiceDetail', function(newValue, oldValue) {
        //    console.log('choiceDetail');
        //    $scope.checkNumber = $scope.route.number;
        //    $scope.checkType = $scope.route.type;
        //});
    }
    angular.module('rozkladApp')
        .controller('RozkladCtrl', ['$scope', rozkladCtrl])
        .controller('LoginCtrl', ['$scope', loginCtrl])
        .controller('GetTransportsCtrl', ['$scope', '$http', getTransportsCtrl])
})();