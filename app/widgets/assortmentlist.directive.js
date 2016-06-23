(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Widgets')
        .directive('Assortmentlist', Assortmentlist);

    Assortmentlist.$inject = [];

    function Assortmentlist() {
        // Usage:
        //     <Assortmentlist></Assortmentlist>
        // Creates:
        // 
        var directive = {
            restrict: 'EA',
            templateUrl: 'App/AssortmentOptimization/Widgets/assortmentList.html',
            scope: {
                'assortments': '=',
                'limit': '=?',
                'showDate': '=?'
            },
            controller: assortmentController,
            controllerAs: 'vm',
            bindToController: true,
            replace: true
        };

        assortmentController.$inject = [];

        function assortmentController() {
            /* jshint validatethis: true */
            var vm = this;

            activate();

            function activate() {
                vm.limit = angular.isDefined(vm.limit) ? vm.limit : 10;
                vm.showDate = angular.isDefined(vm.showDate) ? vm.showDate : false;
            }

            return directive;
        }
    }

})();
