angular.module('App').controller('RootCtrl',
    function ($rootScope, $scope, $cookies, $mdDialog, services) {

        var self            = $scope;
        var root            = $rootScope;
        root.base_url       = window.location.origin;
        root.ANDROID_URL    = "https://play.google.com/store/apps/details?id=com.app.thecity";

        // mount of data per request
        root.LOAD_REQUEST_HOME = 40;
        root.LOAD_REQUEST_MAPS = 40;
        root.LOAD_REQUEST_NEWS = 10;

        // for category
        root.setCurCatId = function (cat_id) {
            $cookies.put(root.base_url + 'cat_id', cat_id);
        };
        root.getCurCatId = function () {
            var cat_id = $cookies.get(root.base_url + 'cat_id');
            return (cat_id != null && cat_id != "") ? cat_id : -1;
        };

        // for page title
        root.setCurTitle = function (title) {
            $cookies.put(root.base_url + 'title', title);
        };
        root.getCurTitle = function () {
            var title = $cookies.get(root.base_url + 'title');
            return (title != null && title != "") ? title : "Semua Bangunan";
        };

        // for current place map
        root.setCurPlaceMap = function (place) {
            var obj = place != null ? {name: place.name, lat: place.lat, lng: place.lng} : null;
            $cookies.put(root.base_url + 'place_map', JSON.stringify(obj));
        };
        root.getCurPlaceMap = function () {
            var str = $cookies.get(root.base_url + 'place_map');
            return (str != null && str != "") ? JSON.parse(str) : null;
        };

        // side menu navigation
        root.menu_top = [
            {
                name: 'Semua Bangunan',
                icon: 'dashboard',
                id: -1,
            }
        ];

        root.menu_category = [
            {
                name: 'Tourist Destination',
                icon: 'card_travel',
                id: 1,
            }, {
                name: 'Food & Drink',
                icon: 'restaurant_menu',
                id: 2,
            }, {
                name: 'Hotels',
                icon: 'hotel',
                id: 3,
            }, {
                name: 'Entertainment',
                icon: 'local_movies',
                id: 4,
            }, {
                name: 'Sport',
                icon: 'directions_bike',
                id: 5,
            }, {
                name: 'Shopping',
                icon: 'shopping_basket',
                id: 6,
            }, {
                name: 'Transportation',
                icon: 'directions_bus',
                id: 7,
            }, {
                name: 'Religion',
                icon: 'location_city',
                id: 8,
            }, {
                name: 'Public Services',
                icon: 'account_balance',
                id: 9,
            }, {
                name: 'Money',
                icon: 'credit_card',
                id: 10,
            }
        ];

        root.aboutDialog = function (ev) {
            $mdDialog.show({
                controller: AboutControllerDialog,
                templateUrl: 'partials/about.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        };

    });

    function AboutControllerDialog($scope, $rootScope, $mdDialog, $window) {
        var self = $scope;
        var root = $rootScope;

        self.getAndroidApp = function () {
            $window.open(root.ANDROID_URL, '_blank');
        };

        self.openTermPolicies = function (ev) {
            $mdDialog.show({
                controller: TermPoliciesControllerDialog,
                templateUrl: 'partials/term_policies.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        };

        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };
    }

    function TermPoliciesControllerDialog($scope, $rootScope, $mdDialog, $window) {
        var self = $scope;
        var root = $rootScope;

        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };
    }
