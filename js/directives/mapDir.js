(function() {
    'use strict';
    var map;
    function mapDir() {
        return {
            link: function (scope, element, attributes) {
                map = new google.maps.Map(document.getElementById('map_container'), {
                    center: {lat: 49.229, lng: 28.473},
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,

                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_CENTER
                    },
                    scaleControl: true,
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_CENTER
                    }
                });
                var styles = [
                    {
                        stylers: [
                            { hue: "#00ffe6" },
                            { saturation: -20 }
                        ]
                    },{
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                            { lightness: 100 },
                            { visibility: "simplified" }
                        ]
                    },{
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                            { visibility: "off" }
                        ]
                    },{
                        featureType: "transit.station",
                        stylers: [
                            { visibility: "off" }
                        ]
                    }
                ];

                //map.setOptions({styles: styles});
                scope.$emit('mapIsLoad', {
                    map: map
                });
            }
        }
    }
    function centrationDir() {
        return {
            link: function (scope, element, attributes) {

                var controlIcon = angular.element('<i>');
                var controlUI = angular.element('<div>');
                controlIcon.addClass('fa fa-crosshairs fa-2x rozklad_Icon');
                controlUI
                    .attr({title: 'Click to recenter the map'})
                    .attr({id: 'rozklad-controlUI'})
                    .addClass('rozklad_UI')
                    .append(controlIcon);
                element.find('#map_container').append(controlUI);
                controlUI.on('click', function() {
                    map.setCenter({lat: 49.229, lng: 28.473});
                    map.setZoom(13);
                });
                //controlUI.index = 1;
                //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlUI);

            }
        }
    }
    function geoDir() {
        return {
            link: function (scope, element, attributes) {
                var geoExist = false;
                var pos;
                var marker;
                var geoIcon = angular.element('<i>');
                var geoUI = angular.element('<div>');
                geoIcon.addClass('fa fa-street-view fa-2x rozklad_Icon');
                geoUI
                    .attr({title: 'Click to find your location'})
                    .attr({id: 'rozklad-geoUI'})
                    .addClass('rozklad_UI')
                    .append(geoIcon);

                element.find('#map_container').append(geoUI);
                geoUI.on('click', function() {

                    if (!geoExist) {
                        var infoWindow = new google.maps.InfoWindow({content: 'Your location'});
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                pos = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                };
                                marker = new google.maps.Marker({
                                    map: map,
                                    place: {
                                        location: pos,
                                        query: 'Google, Vinnica, Ukraine'
                                    }
                                });
                                //marker.setAnimation(google.maps.Animation.DROP);
                                marker.setAnimation(google.maps.Animation.BOUNCE);
                                marker.addListener('click', function() {
                                    //infoWindow.setContent('666');
                                    infoWindow.open(map, marker);
                                });
                                //infoWindow.setPosition(pos);
                                map.setCenter(pos);
                                geoExist = infoWindow.getContent();
                                scope.$emit('getStations', {
                                    pos: pos
                                });
                            }, function () {
                                handleLocationError(true, infoWindow, map.getCenter());
                            });
                        } else {
                            handleLocationError(false, infoWindow, map.getCenter());
                        }
                    } else {
                        marker.setMap(null);
                        geoExist = null;
                    }
                    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                        infoWindow.setPosition(pos);
                        infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
                    }
                });
            }
        }
    }
    function getPositionDir() {
        return {
            link: function (scope, element, attributes) {
                var pos;
                map.addListener('click', function(e) {
                    pos = {lat: e.latLng.lat(), lng: e.latLng.lng()};
                    placeMarkerAndPanTo(e.latLng, map);
                });

                function placeMarkerAndPanTo(latLng, map) {
                    var marker = new google.maps.Marker({
                        position: latLng,
                        draggable: true,
                        map: map
                    });
                    map.panTo(latLng);
                    var infowindow = new google.maps.InfoWindow({
                        content: '<p>Marker Location:' + marker.getPosition() + '</p>'
                    });
                    marker.addListener('click', function(e) {
                        console.log('lat - ', e.latLng.lat());
                        console.log('lng - ', e.latLng.lng());
                        infowindow.open(map, marker);
                    });
                }
            }
        }
    }
    function travelStationsDir() {
        return {
            link: function (scope, element, attributes) {
                var markers = [];
                var flightPath;
                scope.$on('isLoadToDir', function(event, args) {

                    console.log('isLoadToDir');
                    console.log('indexNumber', scope.indexNumber);
                    //console.log('scope.id', scope.$id);
                    var color = 'red';
                    var direct = args.stations;
                    var pathCoordinates = [];
                    if (markers && flightPath) {
                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                        }
                        markers = [];
                        flightPath.setMap(null);
                    }
                    for (var i = 0; i < direct.length; i++) {
                        var pos = {lat: direct[i].lat, lng: direct[i].lng};
                        var marker = new google.maps.Marker({
                            position: pos,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 5,
                                strokeColor: color
                            },
                            map: map
                        });
                        markers.push(marker);
                        pathCoordinates.push(pos);

                    }
                    flightPath = new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: color,
                        strokeOpacity: 1.0,
                        strokeWeight: 5
                    });
                    flightPath.setMap(map);
                    //listen();
                    //scope.$on('$destroy', listen);
                });
            }
        }
    }
    angular.module('rozkladApp')
        .directive('mapDir', mapDir)
        .directive('centrationDir', centrationDir)
        .directive('geoDir', geoDir)
        .directive('getPositionDir', getPositionDir)
        .directive('travelStationsDir', travelStationsDir)
})();