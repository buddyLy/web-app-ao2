(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$timeout', '$window', 'config', 'logger', '$route', 'routehelper', 'userService', '$scope'];

    function Shell($timeout, $window, config, logger, $route, routehelper, userService, $scope) {
        /*jshint validthis: true */
        var vm = this;
        var routes = routehelper.getRoutes();
        vm.isCurrent = isCurrent;

        vm.title = 'Walmart ' + config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.currentUser = {};
        vm.homeUrl = './#/';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.showSettings = showSettings;
        vm.navbarCollapsed = true;

        activate();

        function activate() {
            init();
            getNavRoutes();

            ////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////
            //This will be used to call the user once we have a way to retrieve who is logged on
            ////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////
            //userService.getCurrentUser().then(function (response) {
            //    vm.currentUser = response;
            //});

            //logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function init() {
            $scope.$on('toggleNav', function (event, navOptions) {
                vm.navbarCollapsed = navOptions.navBarCollapsed;
                vm.assortmentName = navOptions.assortmentName;
                vm.assortmentId = navOptions.assortmentId;
                getSummaryNavRoutes(vm.assortmentId);
            });

            $scope.$on('toggleCDTNav', function (event, active) {
                $scope.$emit('toggleRemainingNav', false);
                setActiveNavRoutes("CDT", vm.assortmentId, active);
            });

            $scope.$on('toggleRemainingNav', function (event, active) {
                setActiveNavRoutes("Remaining", vm.assortmentId, active);
            });
        }

        function showSettings() {
            $window.alert('User Settings coming soon.');
        }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function (r) {
                if (r.settings.level === "navbar") {
                    return r.settings && r.settings.nav;
                }
            }).sort(function (r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function setActiveNavRoutes(name, id, active) {
            vm.navSummaryRoutes = routes.filter(function (r) {
                if (r.settings.level === "summary") {
                    var urlparts = r.originalPath.split("/");
                    urlparts[2] = id;
                    r.originalPath = "/" + urlparts[1] + "/" + urlparts[2] + "/" + urlparts[3];

                    if (urlparts[3] === "cdt") {
                        r.settings.active = active;
                    }

                    if (name === "Remaining") {
                        switch (urlparts[3]) {
                            case "cdt":
                                r.settings.active = active;
                                break;
                            case "Loyalty":
                                r.settings.active = active;
                                break;
                            case "StoreClustering":
                                r.settings.active = active;
                                break;
                            case "substitution":
                                r.settings.active = active;
                                break;
                        }
                    }

                    return r.settings && r.settings.nav;
                }
            }).sort(function (r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function getSummaryNavRoutes(id) {
            vm.navSummaryRoutes = routes.filter(function (r) {
                if (r.settings.level === "summary") {
                    var urlparts = r.originalPath.split("/");
                    urlparts[2] = id;
                    r.originalPath = "/" + urlparts[1] + "/" + urlparts[2] + "/" + urlparts[3];
                    return r.settings && r.settings.nav;
                }
            }).sort(function (r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function () {
                vm.showSplash = false;
            }, 3000);
        }
    }
})();
