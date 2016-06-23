(function () {
    'use strict';

    angular
		.module('AssortmentOptimization.Main')
		.controller('Assortmentdiagnostics', Assortmentdiagnostics);

    Assortmentdiagnostics.$inject = ['logger', '$location', '$routeParams', '$timeout', '_', 'config', 'AssortmentoptimizationService', '$scope'];

    function Assortmentdiagnostics(logger, $location, $routeParams, $timeout, _, config, AssortmentoptimizationService, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Assortment Diagnostics';

        activate();

        function activate() {
            vm.assortmentId = $routeParams.id;

            vm.currentDiagnostics = {
                assortmentId: vm.assortmentId,
                capabilityId: null,
                diagnosticResultsExists: false
            };

            vm.diagnosticsRequest = {
                assortmentId: vm.assortmentId
            };

            vm.downloadAssortmentDiagnostics = downloadAssortmentDiagnostics;

            diagnosticsExists();
        }

        function downloadAssortmentDiagnostics() {
            var fileName = 'Diagnostic.csv';
            var fileType = 101;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentDiagnostics.capabilityId, fileType, fileName);
        }

        function diagnosticsExists() {
            console.log("Checking for an existing diagnostics");
            AssortmentoptimizationService.getDiagnostics(vm.assortmentId).then(function (response) {
                if (response.status === 200) {
                    var currentDiagnostics = response.data;
                    if (currentDiagnostics !== null) {
                        vm.currentDiagnostics.capabilityId = response.data.CapabilityId;
                        vm.currentDiagnostics.diagnosticResultsExists = response.data.DiagnosticResultsExists;
                        $scope.$emit('toggleCDTNav', vm.currentDiagnostics.diagnosticResultsExists);
                        if (!vm.currentDiagnostics.diagnosticResultsExists) {
                            toastr.info("Downloads for diagnostics not available, please check again later");
                        }
                        $scope.$emit('toggleNav', {
                            navBarCollapsed: false, assortmentId: response.data.AssortmentId, assortmentName: response.data.AssortmentName
                        });
                        vm.assortmentName = response.data.AssortmentName;
                        vm.department = response.data.Department;
                        vm.rollupLevel = response.data.RollupName;
                    }
                } else if (response.status === 404) {
                    //$scope.$emit("handle404", "Unable to Load Diagnostic for Assortment:");
                    $location.path('/error/404');
                }
                else {
                    console.log("Unsuccessfully retrieval with rc=" + response.status);
                    toastr.error("Unsuccessful retrieval");
                }
            });
        }
    }
})();
