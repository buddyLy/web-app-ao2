(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Main')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/assortment/:id/diagnostics',
                config: {
                    templateUrl: 'App/AssortmentOptimization/Main/AssortmentDiagnostics/assortmentdiagnostics.html',
                    controller: 'Assortmentdiagnostics',
                    controllerAs: 'vm',
                    title: 'Diagnostics',
                    settings: {
                        active: true,
                        level: "summary",
                        nav: 1,
                        content: '<i class="icon icon-list-ul"></i> Diagnostics'
                    }
                }
            },
            {
                url: '/assortment/:id/cdt',
                config: {
                    templateUrl: 'App/AssortmentOptimization/Main/CDT/cdt.html',
                    controller: 'CDT',
                    controllerAs: 'vm',
                    title: 'CDT',
                    settings: {
                        active: false,
                        level: "summary",
                        nav: 1,
                        content: '<i class="icon icon-sitemap"></i> CDT'
                    }
                }
            },
            {
                url: '/assortment/:id/Loyalty',
                config: {
                    templateUrl: 'App/AssortmentOptimization/Main/Loyalty/Loyalty.html',
                    controller: 'Loyalty',
                    controllerAs: 'vm',
                    title: 'Loyalty',
                    settings: {
                        active: false,
                        level: "summary",
                        nav: 1,
                        content: '<i class="icon icon-star"></i> Loyalty'
                    }
                }
            },
            {
                url: '/assortment/:id/StoreClustering',
                config: {
                    templateUrl: 'App/AssortmentOptimization/Main/StoreClustering/StoreClustering.html',
                    controller: 'StoreClustering',
                    controllerAs: 'vm',
                    title: 'StoreClustering',
                    settings: {
                        active: false,
                        level: "summary",
                        nav: 1,
                        content: '<i class="icon icon-th"></i> Store Clustering'
                    }
                }
            }
            ,
            {
                url: '/assortment/:id/substitution',
                config: {
                    templateUrl: 'App/AssortmentOptimization/Main/substitution/substitution.html',
                    controller: 'Substitution',
                    controllerAs: 'vm',
                    title: 'Substitution',
                    settings: {
                        active: false,
                        level: "summary",
                        nav: 1,
                        content: '<i class="icon icon-random"></i> Substitution'
                    }
                }
            }
        ];
    }
})();
