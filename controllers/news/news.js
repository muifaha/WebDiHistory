angular.module('App').controller('NewsCtrl',
    function ($scope, $rootScope, $window, $mdBottomSheet, $mdToast, $mdSidenav, $mdDialog, $timeout, services, focus) {

        var self = $scope;
        var root = $rootScope;
        self.base_url       = window.location.origin;
        self.search_mode    = false;

        self.loading        = true;
        self.load_more      = true;
        self.image_path     = "";
        self.news           = [];
        var paging_limit   = root.LOAD_REQUEST_NEWS;
        var paging_current = 1;

        self.pagetitle      = "News Info";

        services.getNewsImagePath().then(function (resp) {
            self.image_path = resp.data;
        });

        self.refreshData = function () {
            paging_current = 1;
            self.loadData();
        };

        self.loadData = function () {
            self.news = [];
            self.loading = true;

            services.getNewsCount().then(function(resp){
                self.paging_total = Math.ceil(resp.data / paging_limit);
                self.paging_modulo_item = resp.data % paging_limit;
                requestData(true);
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
            requestData(false);
        };

        var requestData = function (first) {
            $timeout(function () {
                $limit = paging_limit;
                $current = (paging_current * paging_limit) - paging_limit + 1;
                services.getNewsByPage($current, $limit).then(function(resp){
                    console.log(resp.data);
                    self.loading = false;
                    self.load_more = false;
                    if(resp.data){
                        self.news = self.news.concat(resp.data);
                    }
                    $timeout(function () {
                        if(first && paging_current < self.paging_total && !isLoadMoreScrollable()){
                            paging_current++;
                            self.load_more = true;
                            requestData(first);
                        }
                    }, 100);
                });
            }, 1000);
        };

        self.loadData();

        self.goBack = function() {
            window.history.back();
        };

        self.getAndroidApp = function () {
            $window.open(root.ANDROID_URL, '_blank');
        };

        self.detailsNews = function (ev, n) {
            $mdDialog.show({
                controller: DetailsNewsControllerDialog,
                templateUrl: 'partials/news_details.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                image_path: self.image_path,
                news: n
            })
        };

        self.aboutDialog = root.aboutDialog;

    });

    function DetailsNewsControllerDialog($scope, $rootScope, $mdDialog, image_path, news) {
        var self = $scope;
        var root = $rootScope;
        self.news = news;
        self.image_path = image_path;
        self.full_image_path = encodeURI(image_path + news.image);
        self.hide = function () {
            $mdDialog.hide();
        };
        self.cancel = function () {
            $mdDialog.cancel();
        };
    }