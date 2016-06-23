(function () {
    'use strict';

    angular
        .module('Blocks.Exception')
        .factory('exception', exception);

    /* @ngInject */
    function exception(logger) {

        var service = {
            catcher: catcher
        };

        return service;

        function catcher(message) {
            return function (reason) {
                logger.error(message, reason);
            };
        }
    }
})();