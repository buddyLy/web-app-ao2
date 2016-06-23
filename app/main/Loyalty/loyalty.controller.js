(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Main')
        .controller('Loyalty', Loyalty);

    Loyalty.$inject = ['$timeout', '$window', '$location', 'config', 'logger', 'AssortmentoptimizationService', '$routeParams', '$scope'];

    function Loyalty($timeout, $window, $location, config, logger, AssortmentoptimizationService, $routeParams, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Loyalty';

        initialize();
        activate();

        function initialize() {
            vm.assortmentId = $routeParams.id;
            vm.currentLoyalty = {
                statusCode: null,
                loyaltyMetricsExist: false,
                disabledCreate: false
            };

            vm.loyaltyRequest = {
                loyaltyLevel: 'Node',
                useClustering: false,
                assortmentId: vm.assortmentId
            };

            vm.itemFileId = "loyaltyItemFile";
            vm.clusterFileId = "loyaltyStoreClusterFile";
            inputFileData[vm.itemFileId] = "";
            inputFileData[vm.clusterFileId] = "";

            vm.createLoyalty = createLoyalty;
            vm.downloadItemMetrics = downloadItemMetrics;
            vm.downloadLoyaltyTemplate = downloadLoyaltyTemplate;
			vm.downloadClusteringTemplate = downloadClusteringTemplate;
			vm.disableCreate = disableCreate;
        }

		function disableCreate(){
			$scope.isFileChosen = false;
		}

        function activate() {
            console.log(vm.title);
            console.log(vm.assortmentId);

            loyaltyExists();
        }

        function noItemFileSelected() {
            if (document.getElementById('vm_loyalty_itemlist').files[0]) {
                return false;
            }
            else {
                return true;
            }
        }

        function downloadLoyaltyTemplate() {
            console.log("downloading loyalty template");
            var templateName = 'LoyaltyClusterTemplate.csv';

            AssortmentoptimizationService.dlTemplate(templateName).then(function (response) {
                console.log("getting template");
                AssortmentoptimizationService.saveTemplate(response.data, templateName);
            });
        }
        
        function downloadClusteringTemplate() {
            console.log("downloading store clustering template");
            var templateName = 'StoreClusterTemplate.csv';

            AssortmentoptimizationService.dlTemplate(templateName).then(function (response) {
                console.log("getting template");
                AssortmentoptimizationService.saveTemplate(response.data, templateName);
            });
        }

        function createLoyalty() {
            vm.loyaltyRequest.itemList = inputFileData[vm.itemFileId];
            vm.loyaltyRequest.storeClustering = inputFileData[vm.clusterFileId];

            AssortmentoptimizationService.createLoyalty(vm.loyaltyRequest).then(function (response) {
                if (response.status === 201) {
                    toastr.success('Submission Successful');
                    $location.path('#/');
                }
                else {
                    console.log("Unsuccessfully created with rc=" + response.status);
                    toastr.error("Unsuccessful submission");
                }
            });
        }

        function loyaltyExists() {
            console.log("Checking for an existing loyalty");
            AssortmentoptimizationService.getLoyalty(vm.assortmentId).then(function (response) {
                if (response.status === 200) {
                    var currentLoyalty = response.data;
                    if (currentLoyalty != null) {
                        vm.currentLoyalty.capabilityId = currentLoyalty.CapabilityId;
                        vm.currentLoyalty.loyaltyMetricsExist = currentLoyalty.LoyaltyMetricsExist;
                        vm.currentLoyalty.statusCode = currentLoyalty.StatusCode;
                        if (!vm.currentLoyalty.loyaltyMetricsExist) {
                            toastr.info("Downloads loyalty not available, please check again later");
                        }
                        $scope.$emit('toggleNav', {
                            navBarCollapsed: false, assortmentId: response.data.AssortmentId, assortmentName: response.data.AssortmentName
                        });
                        if(canSubmitLoyalty(vm.currentLoyalty.statusCode)){
                        	vm.currentLoyalty.disabledCreate = false;
                        }
                        else{
                        	vm.currentLoyalty.disabledCreate = true;
                        }
                    }
                }
                else if (response.status === 404) {
                }
                else {
                    console.log("Unsuccessfully retrieval with rc=" + response.status);
                    toastr.error("Unsuccessful submission");
                }
            });
        }

        function downloadItemMetrics() {
            var fileName = 'ItemMetrics.csv';
            var fileType = 402;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentLoyalty.capabilityId, fileType, fileName);
        }
        
        function canSubmitLoyalty(capStatus) {
		    //return true on error or done status
		    if (capStatus === 1 || capStatus === 4){
		    	return true;
		    }
		    else{
		    	return false;
		    }
		}
    }
})();
