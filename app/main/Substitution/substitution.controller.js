(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Main')
        .controller('Substitution', Substitution);

    Substitution.$inject = ['$timeout', '$window', '$location', '$modal', '$routeParams', 'config', 'logger', 'AssortmentoptimizationService'];

    function Substitution($timeout, $window, $location, $modal, $routeParams, config, logger, AssortmentoptimizationService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Substitution';
        vm.capabilityId = 5;

        initialize();
        activate();

        function initialize() {
            vm.assortmentId = $routeParams.id;

            vm.currentSub = {
                statusCode: null,
                substitutionMetricsExist: false,
                disabledCreate: false
            };

            vm.substitutionRequest = {
                assortmentId: vm.assortmentId
            };

            vm.itemFileId = "subItemFile";
            inputFileData[vm.itemFileId] = "";

            vm.createSubstitution = createSubstitution;
            vm.downloadSubstitution = downloadSubstitution;
            vm.downloadSubstitutionTemplate = downloadSubstitutionTemplate;
        }

        function activate() {
            console.log(vm.title);
            console.log(vm.assortmentId);

            substitutionExists();
        }


        function downloadSubstitutionTemplate() {
            console.log("downloading substitution template");
            var templateName = 'SubstitutionTemplate.csv';

            AssortmentoptimizationService.dlTemplate(templateName).then(function (response) {
                console.log("getting template");
                AssortmentoptimizationService.saveTemplate(response.data, templateName);
            });
        }

        function downloadSubstitution() {
            var fileName = 'SubstitutionMetrics.csv';
            var fileType = 501;
            AssortmentoptimizationService.downloadCapabilityFiles(vm.currentSub.capabilityId, fileType, fileName);
        }

        function createSubstitution() {
            vm.substitutionRequest.itemList = inputFileData[vm.itemFileId];

            AssortmentoptimizationService.createSubstitution(vm.substitutionRequest).then(function (response) {
                if (response.status === 201) {
                    toastr.success('Submission Successful');
                    $location.path('#/');
                }
                else {
                    console.log("Unsuccessfully submission with rc=" + response.status);
                    toastr.error("Unsuccessful submission");
                }
            });
        }

        function substitutionExists() {
            console.log("Checking for an existing substitution");
            AssortmentoptimizationService.getSubstitution(vm.assortmentId).then(function (response) {
                if (response.status === 200) {
                    var currentSub = response.data;
                    if (currentSub !== null) {
                        vm.currentSub.capabilityId = currentSub.CapabilityId;
                        vm.currentSub.statusCode = currentSub.StatusCode;
                        vm.currentSub.substitutionMetricsExist = currentSub.SubstitutionMetricsExist;
                        if (!vm.currentSub.substitutionMetricsExist) {
                            toastr.info("Downloads substitution metrics not available, please check again later");
                        }
                        if(canSubmitSubstitution(vm.currentSub.statusCode)){
                        	vm.currentSub.disabledCreate = false;
                        }
                        else{
                        	vm.currentSub.disabledCreate = true;
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
        
        function canSubmitSubstitution(capStatus) {
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
