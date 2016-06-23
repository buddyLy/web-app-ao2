(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Home')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/home/home.html',
                    controller: 'Home',
                    controllerAs: 'vm',
                    title: 'Assortments',
                    settings: {
                        level: "navbar",
                        nav: 1,
                        content: '<i class="icon icon-list-ul"></i> Assortments'
                    }
                }
            },
            {
                url: '/error/:httpStatus',
                config: {
                    templateUrl: 'app/home/home.html',
                    controller: 'Home',
                    controllerAs: 'vm',
                    title: 'Assortments',
                    settings: {
                        level: "error",
                        nav: 1,
                        content: '<i class="icon icon-list-ul"></i> Assortments'
                    }
                }
            }
        ];
    }
})();
