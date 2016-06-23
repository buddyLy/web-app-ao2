(function () {
    'use strict';

    angular
		.module('AssortmentOptimization.Home')
		.controller('ModalController', ModalController);

    ModalController.$inject = ['$window', '$location', '$modalInstance', '$modal', '$scope', 'AssortmentoptimizationService'];

    function ModalController($window, $location, $modalInstance, $modal, $scope, AssortmentoptimizationService) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Add Assortment';
        $scope.isFileChosen = false; 
        //var fileData;

        activate();
        initialize();

        function activate() {
            vm.createAssortment = createAssortment;
            vm.downloadDiagnosticsTemplate = downloadDiagnosticsTemplate;
            vm.cancel = cancel;

            vm.diagFileId = 'diagItemFile';
            inputFileData[vm.diagFileId] = "";
        }

        function initialize() {
            vm.assortment = {
                rollupid: '1'
            };
        }

        function downloadDiagnosticsTemplate() {
            console.log("downloading template");
            var templateName = 'ItemListTemplate.csv';

            AssortmentoptimizationService.dlTemplate(templateName).then(function (response) {
                console.log("getting diagnostics template");

                templateName = "ItemListTemplate.csv";
                AssortmentoptimizationService.saveTemplate(response.data, templateName);
            });
        }


        function destroyClickedElement(event) {
            document.body.removeChild(event.target);
        }

        function createAssortment() {
            console.log("Creating Assortment from modal");
            vm.assortment.fileData = inputFileData[vm.diagFileId];

            AssortmentoptimizationService.addAssortment(vm.assortment).then(function (response) {
                console.log("Done creating assortment with data: " + response);
                var rc = response.status;
                console.log("return code is:" + rc);
                if (rc === 201) {
                    toastr.success('Successfully created project');
                    $location.path('#/');
                    $modalInstance.close(vm.assortment);
                }
                else {
                    console.log("Error. Http repsonse code:" + rc);
                    toastr.error('Unsuccessful project creation');
                    //$modalInstance.close(vm.assortment);
                }
            });
        }

        function cancel() {
            console.log("Cancelled");
            $modalInstance.dismiss('cancel');
        }
    }
})();
