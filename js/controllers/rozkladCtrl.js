(function() {
    'use strict';
    function rozkladCtrl($scope) {
        $scope.name = 'rrr';
    }
    function loginCtrl($scope) {
    }
    angular.module('rozkladApp')
        .controller('RozkladCtrl', ['$scope', rozkladCtrl])
        .controller('LoginCtrl', ['$scope', loginCtrl])
})();