(function () {
    'use strict';

    angular
		.module('AssortmentOptimization.Main')
		.controller('CDT', CDT);

    CDT.$inject = ['$timeout', '$window', '$location', '$modal', 'config', 'logger', 'AssortmentoptimizationService', '$routeParams', '$scope'];

    function CDT($timeout, $window, $location, $modal, config, logger, AssortmentoptimizationService, $routeParams, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'CDT';
        vm.capabilityCode = 2;

        initialize();
        activate();

        function initialize() {
            vm.assortmentId = $routeParams.id;

            vm.currentCdt = {
            	statusCode: null,
                assortmentId: vm.assortmentId,
                capabilityId: null,
                yulesQExists: false,
                itemMetricsExists: false,
                assortDescExists: false,
                disabledCreate: false
            };

            vm.cdtRequest = {
                assortmentId: vm.assortmentId
            };

            vm.downloadYulesQ = downloadYulesQ;
            vm.downloadItemMetrics = downloadItemMetrics;
            vm.downloadAssortDesc = downloadAssortDesc;
            vm.createYulesQ = createYulesQ;
            vm.decisionTreeExists = decisionTreeExists;
        }

        function activate() {
            console.log(vm.title + " " + vm.assortmentId);
            decisionTreeExists();
        }

        function downloadYulesQ() {
            var fileName = 'yulesQ.csv';
            var fileType = 200;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentCdt.capabilityId, fileType, fileName);
        }

        function downloadItemMetrics() {
            var fileName = 'ItemMetrics.csv';
            var fileType = 201;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentCdt.capabilityId, fileType, fileName);
        }

        function downloadAssortDesc() {
            var fileName = 'AssortDesc.csv';
            var fileType = 202;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentCdt.capabilityId, fileType, fileName);
        }

        function createYulesQ() {
            console.log("Creating a new decision tree");
            AssortmentoptimizationService.createYulesQ(vm.cdtRequest).then(function (response) {
                var rc = response.status;
                console.log("return code is:" + rc);

                if (rc === 201) {
                    toastr.success('Submission Successful');
                    $location.path('#/');
                }
                else {
                    console.log("Unsuccessfully created with rc=" + rc);
                    toastr.error("Unsuccessful submission");
                }
            });
        }

        function decisionTreeExists() {
            console.log("Checking for an existing decision tree");
            AssortmentoptimizationService.getDecisionTree(vm.assortmentId).then(function (response) {
                if (response.status === 200) {
                    var currentCDT = response.data;
                    if (currentCDT != null) {
                        vm.currentCdt.capabilityId = currentCDT.CapabilityId;
                        vm.currentCdt.yulesQExists = currentCDT.YulesQMatrixExists;
                        vm.currentCdt.itemMetricsExists = currentCDT.ItemMetricsExists;
                        vm.currentCdt.assortDescExists = currentCDT.AssortmentDescriptionExists;
                        vm.currentCdt.statusCode = currentCDT.StatusCode;

                        if (vm.currentCdt.yulesQExists && vm.currentCdt.itemMetricsExists && vm.currentCdt.assortDescExists) {
                            $scope.$emit('toggleRemainingNav', true);
                        } else {
                            $scope.$emit('toggleRemainingNav', false);
                        }
                        $scope.$emit('toggleNav', {
                            navBarCollapsed: false, assortmentId: response.data.AssortmentId, assortmentName: response.data.AssortmentName
                        });


                        if (!vm.currentCdt.yulesQExists) {
                            toastr.info("Downloads Yule's Q not available, please check again later");
                        }
                        if (!vm.currentCdt.itemMetricsExists) {
                            toastr.info("Downloads item metrics not available, please check again later");
                        }
                        if (!vm.currentCdt.assortDescExists) {
                            toastr.info("Downloads assortment description not available, please check again later");
                        }
                        if(canSubmitCdt(vm.currentCdt.statusCode)){
                        	vm.currentCdt.disabledCreate = false;
                        }
                        else{
                        	vm.currentCdt.disabledCreate = true;
                        }
                        	
                    }
                }
                else if (response.status === 404) {
                }
                else {
                    toastr.error("Unsuccessful retrieval");
                }
            });
        }
        
        function canSubmitCdt(capStatus) {
		    //can only submit if it errored
		    if (capStatus === 1){
		    	return true;
		    }
		    else{
		    	return false;
		    }
		}
    }
})();
