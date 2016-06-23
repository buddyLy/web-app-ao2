(function () {
    'use strict';

    angular.module('AssortmentOptimization.Core', [

        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize', 'ngMessages',

        /*
         * Our reusable cross app code modules
         */
        'Blocks.Exception', 'Blocks.Logger', 'Blocks.Router',

        /*
         * 3rd Party modules
         */
        'ngplus',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.grid.resizeColumns'

    ]);
})();