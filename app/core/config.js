(function () {
    'use strict';

    var core = angular.module('AssortmentOptimization.Core');

    var config = {
        appTitle: 'Assortment Optimization',
        appErrorPrefix: '[Assortment Error] ',
        version: '1.0.0'
    };
    core.constant('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionHandlerProvider', 'toastr', '$httpProvider'];
    function configure($logProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider, toastr, $httpProvider) {

        $httpProvider.interceptors.push('httpRequestInterceptor');

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'AO:';
        //var resolveAlways = { /* @ngInject */
        //    ready: function (dataservice) {
        //        return dataservice.ready();
        //    }
        //    // ready: ['dataservice', function (dataservice) {
        //    //    return dataservice.ready();
        //    // }]
        //};
        //routehelperConfigProvider.config.resolveAlways = resolveAlways;

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);

        toastr.options.timeOut = 3000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    core.run(coreRun);

    coreRun.$inject = ['$route', '$rootScope', '$location'];

    function coreRun($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            return original.apply($location, [path]);
        };
    }
})();