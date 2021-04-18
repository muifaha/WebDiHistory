angular.module('App').controller('HomeCtrl',
    function ($scope, $rootScope, $window, $mdBottomSheet, $mdToast, $mdSidenav, $mdDialog, $timeout, services, focus) {

        var self = $scope;
        var root = $rootScope;
        self.toggleLeft     = buildToggler('left');
        self.toggleRight    = buildToggler('right');
        self.base_url       = window.location.origin;
        self.search_mode    = false;

        self.loading        = true;
        self.load_more      = true;
        self.image_path     = "";
        self.places         = [];
        self.q              = "";
        var paging_limit   = root.LOAD_REQUEST_HOME;
        var paging_current = 1;

        self.pagetitle      = root.getCurTitle();
        self.menu_top       = root.menu_top;
        self.menu_category  = root.menu_category;

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            }
        }

        services.getImagePath().then(function (resp) {
            self.image_path = resp.data;
        });

        self.refreshData = function () {
            paging_current = 1;
            self.loadData(root.getCurCatId());
        };

        self.loadData = function (cat_id) {
            var q = self.q ? self.q : "";
            cat_id = self.search_mode ? -1 : cat_id;
            self.places = [];
            self.loading = true;

            services.getPlaceCount(cat_id, q).then(function(resp){
                self.paging_total = Math.ceil(resp.data / paging_limit);
                self.paging_modulo_item = resp.data % paging_limit;
                requestData(true, cat_id, q);
            });
        };

        var isLoadMoreScrollable = function(){
            var el = document.getElementById("main-content");
            return (el.scrollTop + el.offsetHeight < el.scrollHeight);
        };

        self.loadMore = function () {
            if(!self.loading && !self.load_more && paging_current < self.paging_total){
                paging_current++;
                self.load_more = true;
            } else {
                return;
            }
            var cat_id = root.getCurCatId();
            var q = self.q ? self.q : "";
            cat_id = self.search_mode ? -1 : cat_id;
            requestData(false, cat_id, q);
        };

        var requestData = function (first, cat_id, q) {
            $timeout(function () {
                $limit = paging_limit;
                $current = (paging_current * paging_limit) - paging_limit + 1;
                services.getPlacesByPage($current, $limit, cat_id, q).then(function(resp){
                    console.log(resp.data);
                    self.loading = false;
                    self.load_more = false;
                    if(resp.data){
                        self.places = self.places.concat(resp.data);
                    }
                    $timeout(function () {
                        if(first && paging_current < self.paging_total && !isLoadMoreScrollable()){
                            paging_current++;
                            self.load_more = true;
                            requestData(first, cat_id, q);
                        }
                    }, 100);
                });
            }, 1000);
        };

        self.openMapPage = function () {
            root.setCurPlaceMap(null);
            window.location.href = 'maps.html';
        };

        // open search toolbar
        self.openSearchMode = function () {
            self.q = "";
            self.search_mode = true;
            focus('search_input');
        };
        // close search toolbar
        self.closeSearchMode = function () {
            self.q = "";
            self.search_mode = false;
            self.refreshData();
        };

        self.submitSearch = function(ev, q) {
            self.q = q;
            self.refreshData();
        };

        self.keypressAction = function(k_ev, q) {
            if (k_ev.which === 13){
                self.submitSearch(k_ev, q);
            }
        };

        self.loadData(self.getCurCatId());

        self.onMenuClick = function (menu) {
            if(menu.id == -2){
                window.location.href = 'news.html';
                return;
            }
            self.toggleLeft();
            self.loadData(menu.id);
            self.pagetitle = menu.name;
            root.setCurCatId(menu.id);
            root.setCurTitle(menu.name);
        };

        self.getAndroidApp = function () {
            $window.open(root.ANDROID_URL, '_blank');
        };

        self.detailsPlace = function (ev, p) {
            $mdDialog.show({
                controller: DetailsPlaceControllerDialog,
                templateUrl: 'partials/place_details.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                image_path: self.image_path,
                place: p
            })
        };

        self.aboutDialog = root.aboutDialog;

    });

    function DetailsPlaceControllerDialog($scope, $rootScope, $mdDialog, services, image_path, place) {
        var self = $scope;
        var root = $rootScope;
        self.place = place;
        self.images = [];
        self.image_path = image_path;
        self.full_image_path = encodeURI(image_path + place.image);
        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };

        self.images.push({"name": place.image});

        services.getImagesByPlaceId(place.place_id).then(function (resp) {
            for (var i = 0; i < resp.data.length; i++) {
                self.images.push(resp.data[i]);
            }
        });

        /* function for Google Maps property */
        angular.element(document).ready(function () {
            self.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
            createMarker(place);
        });

        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(place.lat, place.lng),
            scrollwheel: false
        };

        self.markers = [];

        var createMarker = function (info) {
            var marker = new google.maps.Marker({
                map: self.map,
                position: new google.maps.LatLng(info.lat, info.lng),
                title: info.name
            });
            self.markers.push(marker);
        };

        self.navigate = function () {
            var url = "https://maps.google.com?daddr=" + place.lat + "," + place.lng;
            var win = window.open(url, '_blank');
            if (win) {
                win.focus();
            } else {
                alert('Please allow popups for this website');
            }
        };

        self.openWebsite = function (w) {
            if(w == null || w == '-') return;
            if(!w.startsWith("http")) w = 'http://'+w;
            var win = window.open(w, '_blank');
            if (win) {
                win.focus();
            } else {
                alert('Please allow popups for this website');
            }
        };
        self.dialPhone = function (phone) {
            if(phone == null || phone == '-') return;
            window.open("tel:"+phone);
        };
        self.view = function () {
            root.setCurPlaceMap(place);
            window.location.href = 'maps.html';
        };

}