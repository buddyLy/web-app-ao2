(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Services')
        .service('uploadService', uploadService);

    uploadService.$inject = ['$http', '$location', '$timeout', 'Upload'];

    function uploadService($http, $location, $timeout, Upload) {
        var serviceApi = "";

        var service = {
            upload: uploadService
        };

        return service;

        function uploadService(file) {
            Upload.upload({
                url: serviceApi,
                fields: { 'username': $scope.username },
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
            })
        }
    }
})();
