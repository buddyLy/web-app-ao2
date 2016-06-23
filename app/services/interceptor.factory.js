(function () {
    "use strict";

    angular
        .module("AssortmentOptimization.Services")
        .factory("httpRequestInterceptor", httpRequestInterceptor);

    httpRequestInterceptor.$inject = ["$q", "$location"];

    function httpRequestInterceptor($q, $location) {

        var service = {
            responseError: responseError
        };

        return service;

        function responseError(rejection) {

            switch (rejection.status) {
                case 404:
                    console.log("Resource unavailable thrown");
                    //returns the promise intact;
                    return rejection;
                    break;
                case 403:
                    console.log("Security Error");
                    toastr.error("Security Error Occurred. You may not have permission");
                    break;
                case 500:
                    console.log(rejection.statusText);
                    toastr.error(rejection.statusText);
                    break;
                default:
                    console.log(rejection.statusText + " Response code:" + rejection.status);
                    toastr.error(rejection.statusText + " Response code:" + rejection.status);
            }

            //Kills the promise
            return $q.reject(rejection);
        }
    }
})();
