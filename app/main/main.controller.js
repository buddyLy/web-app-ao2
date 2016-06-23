(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Main')
        .controller('Main', Main);

    Main.$inject = ['$timeout', '$window', 'config', 'logger', '$route', 'routehelper', 'userService'];

    function Main($timeout, $window, config, logger, $route, routehelper, userService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Main';
        var routes = routehelper.routes;
        vm.isCurrent = isCurrent;

        console.log(vm.routes);

        activate();

        function activate() {
            getNavRoutes();
            //logger.success(config.appTitle + ' loaded!', null);
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                if (r.settings.level === "summary") {
                    return r.settings && r.settings.nav;
                }
            }).sort(function (r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return false;
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? true : false;
        }
    }
})();
