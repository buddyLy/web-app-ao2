(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Services')
        .factory('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        var serviceApi = 'api/users/';

        var service = {
            getCurrentUser: getCurrentUser
        };

        return service;

        function getCurrentUser() {
            return $http.get(serviceApi + 'currentUser').then(function (response) {
                return response.data;
            });
        }
    }
})();
