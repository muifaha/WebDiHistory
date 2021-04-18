angular.module('App', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngMessages', 'ngCookies', 'ngSanitize']);

angular.module('App').config(function ($mdThemingProvider) {
    // Extend the cyan theme with a few different colors
    var blueGrey = $mdThemingProvider.extendPalette('cyan', {
        '500': '475b84',
        'contrastDefaultColor': 'light'
    });

    // Extend the amber theme with a few different colors
    var lightRed = $mdThemingProvider.extendPalette('red', {
        '500': 'b6293d'
    });

    var grey = $mdThemingProvider.extendPalette('grey', {
        '500': 'FFFFFF',
        'contrastDefaultColor': 'dark'
    });

    // Register the new color palette
    $mdThemingProvider.definePalette('blueGrey', blueGrey);
    $mdThemingProvider.definePalette('lightRed', lightRed);
    $mdThemingProvider.definePalette('grey', grey);

    $mdThemingProvider.theme('default').primaryPalette('blueGrey').accentPalette('lightRed');
    $mdThemingProvider.theme('default-dark').primaryPalette('grey').accentPalette('lightRed');

});

angular.module('App').factory('focus', function($timeout, $window) {
    return function(id) {
        // timeout makes sure that is invoked after any other event has been triggered.
        // e.g. click events that need to run before the focus or inputs elements that are in a disabled state but are enabled when those events are triggered.
        $timeout(function() {
            var element = $window.document.getElementById(id);
            if(element)element.focus();
        });
    };
});

angular.module('App').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

angular.module('App').directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight + 1 >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

angular.module('App').filter('trustAsHtml', function($sce) {
    return function(html) {
        return $sce.trustAsHtml(html);
    };
});

