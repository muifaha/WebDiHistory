angular.module('App').factory("services", function ($http) {

    var serviceBase = 'services/';
    var obj = {};

    /*
     * PLACE -----------------------------------------------------------------------------------
     */
    obj.getPlaces = function (cat_id, q) {
        return $http.get(serviceBase + 'getPlaces?cat_id=' + cat_id + '&q=' + q);
    };

    obj.getImagesByPlaceId = function (place_id) {
        return $http.get(serviceBase + 'getImagesByPlaceId?place_id=' + place_id);
    };

    obj.getImagePath = function () {
        return $http.get(serviceBase + 'getImagePath');
    };

    obj.getPlaceCount = function (cat_id, q) {
        return $http.get(serviceBase + 'getPlaceCount?cat_id='+cat_id+'&q='+q);
    };

    obj.getPlacesByPage = function (page, limit, cat_id, q) {
        return $http.get(serviceBase + 'getPlacesByPage?page=' +page+'&limit='+limit+'&cat_id='+cat_id+'&q='+q);
    };

    /*
     * NEWS INFO -----------------------------------------------------------------------------------
     */
    obj.getNewsCount = function () {
        return $http.get(serviceBase + 'getNewsCount');
    };

    obj.getNewsByPage = function (page, limit) {
        return $http.get(serviceBase + 'getNewsByPage?page=' +page+'&limit='+limit);
    };

    obj.getNewsImagePath = function () {
        return $http.get(serviceBase + 'getNewsImagePath');
    };

    return obj;
});
