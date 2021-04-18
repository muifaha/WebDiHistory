angular.module('App').controller('MapsCtrl',
function ($scope, $rootScope, $mdBottomSheet, $mdSidenav, $mdDialog, $cookies, $timeout, services) {
    var self            = $scope;
	var root            = $rootScope;
    self.base_url 		= window.location.origin;

    self.loading        = true;
    self.places         = [];

    self.total_place    = '';
    self.load           = root.LOAD_REQUEST_MAPS;
    var paging_current = 1;
    var paging_limit   = root.LOAD_REQUEST_MAPS;

    self.pagetitle      = "Semua Bangunan";
    self.all_menu       = root.menu_top.concat(root.menu_category);

    self.loadData = function(cat_id){
	    self.places = [];
        self.loading = true;
        services.getPlaceCount(cat_id, "").then(function(resp){
            self.total_place = resp.data;
            self.paging_total = Math.ceil(resp.data / paging_limit);
            self.paging_modulo_item = resp.data % paging_limit;
            if(self.total_place <= root.LOAD_REQUEST_MAPS){
                self.load = self.total_place;
            }
            requestData(cat_id);
        });
    };

    var requestData = function (cat_id) {
        $timeout(function () {
            $limit = paging_limit;
            $current = (paging_current * paging_limit) - paging_limit + 1;
            services.getPlacesByPage($current, $limit, cat_id, "").then(function(resp){
                if(resp.data != null) {
                    self.places = self.places.concat(resp.data);
                }
                paging_current++;
                if(paging_current <= self.paging_total){
                    if (paging_current == self.paging_total && self.paging_modulo_item > 0) {
                        self.load = self.load + self.paging_modulo_item;
                    } else {
                        self.load = paging_current * paging_limit;
                    }
                    requestData(cat_id);
                } else {
                    self.loading = false;
                    populateMarker(self.places);
                }
            });
        }, 1000);
    };

	self.onMenuClick = function(menu){
        self.total_place    = "";
        paging_current = 1;
	    clearMarkers();
	    self.loadData(menu.id);
	    self.pagetitle = menu.name;
	};

	self.goBack = function() {
        window.history.back();
    };


    /* function for Google Maps property */
    self.map = null;
    self.markers = [];
    var markerCluster = null;

    var initializeMaps = function(){
        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(-6.9174639, 107.6191228)
        };
        self.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    };

    var infoWindow = new google.maps.InfoWindow();
    var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: self.map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.name
        });

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h3>' + marker.title + '</h3>');
            infoWindow.open(self.map, marker);
        });
        self.markers.push(marker);
    };

    var populateMarker = function (places){
        initializeMaps();
        for (var i = 0; i < places.length; i++){
            createMarker(places[i]);
        }
        setMarkerCluster();
    };

    var clearMarkers = function() {
        for (var i = 0; i < self.markers.length; i++){
            self.markers[i].setMap(null);
        }
        if(markerCluster != null){
            markerCluster.clearMarkers();
        }
        self.markers = [];
    };

    var setMarkerCluster = function(){
        markerCluster = new MarkerClusterer(
            self.map,
            self.markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}
        );
    };

    self.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };


    // conditional first action
    if(root.getCurPlaceMap() == null){
        self.loadData(-1);
    } else {
        var cur_place = root.getCurPlaceMap();
        self.pagetitle = cur_place.name;
        initializeMaps();
        createMarker(cur_place);
        self.loading = false;
    }
});