(function() {
    'use strict';
    function mainRoute($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'template/rozklad.html',
                controller: 'RozkladCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'template/login.html',
                controller: 'LoginCtrl'
            })
    }
    angular.module('rozkladApp').config(['$stateProvider', '$urlRouterProvider', mainRoute]);
})();