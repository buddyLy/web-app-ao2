(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Main')
        .controller('StoreClustering', StoreClustering);

    StoreClustering.$inject = ['$timeout', '$window', '$location', '$modal', '$routeParams', 'config', 'logger', 'AssortmentoptimizationService'];

    function StoreClustering($timeout, $window, $location, $modal, $routeParams, config, logger, AssortmentoptimizationService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'StoreClustering';
        vm.capabilityId = 3;

        initialize();
        activate();

        function initialize() {
            vm.assortmentId = $routeParams.id;

            vm.currentCluster = {
                statusCode: null,
                reclassifiedStoresExists: false,
                modelSummaryFileExists: false,
                disabledCreate: false
            };

            vm.clusteringRequest = {
                assortmentId: vm.assortmentId
            };

            vm.storeFileId = "clusteringStoresFile";
            inputFileData[vm.storeFileId] = "";

            vm.createStoreClustering = createStoreClustering;
            vm.downloadReclassifiedStores = downloadReclassifiedStores;
            vm.downloadModelSummary = downloadModelSummary;
            vm.downloadClusteringTemplate = downloadClusteringTemplate;
        }

        function activate() {
            //logger.success(config.appTitle + ' loaded!', null);
            console.log(vm.title);
            console.log(vm.assortmentId);

            storeClusteringExists();
        }


        function storeClusteringExists() {
            console.log("Checking for an existing Store Clustering");
            AssortmentoptimizationService.getStoreClustering(vm.assortmentId).then(function (response) {
                if (response.status === 200) {
                    var currentCluster = response.data;
                    if (currentCluster !== null) {
                        vm.currentCluster.capabilityId = currentCluster.CapabilityId;
                        vm.currentCluster.statusCode = currentCluster.StatusCode;
                        vm.currentCluster.reclassifiedStoresExists = response.data.ReclassifiedStoresExists;
                        vm.currentCluster.modelSummaryFileExists = response.data.ModelSummaryExists;
                        if (!vm.currentCluster.reclassifiedStoresExists) {
                            toastr.info("Downloads store reclassification not available, please check again later");
                        }
                        if (!vm.currentCluster.modelSummaryFileExists) {
                            toastr.info("Downloads model summary not available, please check again later");
                        }
                        if(canSubmitStoreClustering(vm.currentCluster.statusCode)){
                        	vm.currentCluster.disabledCreate = false;
                        }
                        else {
                            vm.currentCluster.disabledCreate = true;
                        }
                    }
                }
                else if (response.status === 404) {
                }
                else {
                    console.log("Unsuccessfully retrieval with rc=" + response.status);
                    toastr.error("Unsuccessful Retrieval");
                }
            });
        }


        function downloadClusteringTemplate() {
            console.log("downloading template");
            var templateName = 'ClusteringTemplate.csv';

            AssortmentoptimizationService.dlTemplate(templateName).then(function (response) {
                console.log("getting template");

                templateName = "ClustertingTemplate.csv";
                AssortmentoptimizationService.saveTemplate(response.data, templateName);
            });
        }

        function downloadReclassifiedStores() {
            var fileName = 'ReclassifiedStores.csv';
            var fileType = 301;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentCluster.capabilityId, fileType, fileName);
        }

        function downloadModelSummary() {
            var fileName = 'ModelSummary.csv';
            var fileType = 302;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentCluster.capabilityId, fileType, fileName);
        }

        function createStoreClustering() {
            vm.clusteringRequest.storeList = inputFileData[vm.storeFileId];

            AssortmentoptimizationService.createStoreClustering(vm.clusteringRequest).then(function (response) {
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
        
		function canSubmitStoreClustering(capStatus) {
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
