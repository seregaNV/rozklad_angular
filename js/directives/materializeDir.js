(function() {
    'use strict';
    function mainDir() {
        return {
            link: function(scope, element, attributes){
                angular.element(document).ready(function() {
                    $(".button-collapse").sideNav();
                    $(".dropdown-button").dropdown({
                        inDuration: 300,
                        outDuration: 1000,
                        constrain_width: false, // Does not change width of dropdown to that of the activator
                        //hover: true, // Activate on hover
                        //gutter: 0, // Spacing from edge
                        belowOrigin: true // Displays dropdown below the button
                        //alignment: 'right' // Displays dropdown with edge aligned to the left of button
                    });
                });
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
                    $('ul.tabs').tabs();
                });
            }
        }
    }
    angular.module('rozkladApp')
        .directive('mainDir', mainDir)
        .directive('parallaxDir', parallaxDir)
        .directive('contentDir', contentDir)
})();