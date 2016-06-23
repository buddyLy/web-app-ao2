(function () {
    'use strict';

    angular
        .module('AssortmentOptimization.Home')
        .controller('Home', Home);

    Home.$inject = [
        '$timeout',
        '$window',
        '$location',
        'config',
        'logger',
        '$modal',
        'AssortmentoptimizationService',
        'uiGridConstants',
        '$scope',
        '$log',
        '$routeParams'
    ];

    function Home($timeout, $window, $location, config, logger, $modal, AssortmentoptimizationService, uiGridConstants, $scope, $log, $routeParams) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = "Home";
        vm.title = "Walmart" + " " + vm.title;
        vm.assortments = [{}];
        vm.navbarCollapsed = true;

        vm.gridOptions = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableColumnResizing: true,
            enableSelectAll: false,
            selectionRowHeaderWidth: 35,
            rowHeight: 35,
            showGridFooter: true,
            paginationPageSizes: [5, 10, 15, 25, 50],
            paginationPageSize: 10,
            modifierKeysToMultiSelect: false,
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenus: false
        };

        vm.gridOptions.columnDefs = [
                { field: 'Id', displayName: "Project Id" },
                { field: 'Name', displayName: "Name" },
                { field: 'Department', displayName: "Dept #" },
                { field: 'CreateTime', displayName: "Create Date" },
                { field: 'LastChangedTime', visible: false },
                { field: 'Creator', displayName: "User ID" },
                {
                    field: 'Status',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {

                        switch (parseStatus(grid.getCellValue(row, col))) {
                            case "Waiting":
                                return 'waitingStatus';
                            case "Done":
                                return 'done';
                            case "Active":
                                return 'active';
                            case "Error":
                                return 'error';
                            default:
                                break;
                        }
                    }
                }
        ];

        function parseStatus(status) {
            return status.substring(status.indexOf('-') + 1);
        }

        function sortNumeric(x,y) {
            if (Number(x) === Number(y)) return 0;
            if (Number(x) > Number(y)) return 1;
            return -1;
        };

        vm.gridOptions.multiSelect = false;
        vm.gridOptions.modifierKeysToMultiSelect = false;
        vm.gridOptions.noUnselect = true;
        vm.gridOptions.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var msg = 'row selected ' + row.isSelected + "- by" + row.entity.Creator;
                showRowSelected(row);
                $log.log(msg);
            });
        };

        activate();

        function activate() {
            getAssortments();
            vm.open = open;
            vm.filter = filter;
            vm.addData = addData;

            if ($routeParams.httpStatus === "404") {
                toastr.error("Your requested assortment was not found.");
            }

            console.log(vm.title);
        }

        function showRowSelected(row) {
            vm.navbarCollapsed = !vm.navbarCollapsed;

            var navOptions = {
                navBarCollapsed: vm.navbarCollapsed,
                assortmentId: row.entity.Id,
                assortmentName: row.entity.Name,
            };

            $scope.$emit('toggleNav', navOptions);

            $location.path('/assortment/' + navOptions.assortmentId + '/diagnostics/');
        }

        function open(size) {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'App/AssortmentOptimization/Home/newAssortment.html',
                controller: 'ModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    items: function () {
                        return vm.assortmentList;
                    }
                }
            });

            modalInstance.result.then(function (assortment) {
                console.log(assortment);
                vm.selected = assortment;
            }, function () {
                console.log("Modal dismissed");
            });
        }

        function filter(x) {
            console.log("filtering" + x);
        }

        function getAssortments() {
            console.log("retrieving my assortments");
            AssortmentoptimizationService.getAssortments().then(function (response) {
                vm.gridOptions.data = response.data;
            });
        }
    }
})();
