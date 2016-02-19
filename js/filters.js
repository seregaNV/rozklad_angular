(function() {
    'use strict';
    function checkMark() {
        return function(input) {
            return input ? '\u2714' : '\u2718';
        }
    }
    angular.module('rozkladApp').filter('checkMark', checkMark);
})();