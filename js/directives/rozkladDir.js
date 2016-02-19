(function() {
    'use strict';
    function rozkladDir() {
        return {
            link: function(scope, element, attributes){

            }
        }
    }
    function parallaxDir() {
        return {
            link: function(scope, element, attributes){
                angular.element(document).ready(function() {
                    $('.parallax').parallax();
                });
            }
        }
    }
    function contentDir() {
        return {
            link: function(scope, element, attributes){
                angular.element(document).ready(function() {
                    $('.collapsible').collapsible({
                        accordion : false
                    });
                });
            }
        }
    }
    angular.module('rozkladApp')
        .directive('rozkladDir', rozkladDir)
        .directive('parallaxDir', parallaxDir)
        .directive('contentDir', contentDir)
})();