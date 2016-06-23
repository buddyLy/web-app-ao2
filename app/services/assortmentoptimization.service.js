(function () {
	'use strict';

	angular
		.module('AssortmentOptimization.Services')
		.service('AssortmentoptimizationService', AssortmentoptimizationService);

	AssortmentoptimizationService.$inject = ['$http', '$q'];

	function AssortmentoptimizationService($http, $q) {
		var service = {
			createYulesQ: createYulesQ,
			getAssortments: getAssortments,
			addAssortment: addAssortment,
			dlTemplate: dlTemplate,
			saveTemplate: saveTemplate,
			isAvailToDownload: isAvailToDownload,
			getCapabilityFiles: getCapabilityFiles,
			createLoyalty: createLoyalty,
			createStoreClustering: createStoreClustering,
			createSubstitution: createSubstitution,
			downloadCapabilityFiles: downloadCapabilityFiles,
			getLoyalty: getLoyalty,
			getDecisionTree: getDecisionTree,
			getSubstitution: getSubstitution,
		    getStoreClustering: getStoreClustering,
		    getDiagnostics: getDiagnostics
		};

		return service;

		/*
 			Download the available files for the capabilities
		 */
		function getCapabilityFiles(capabilityId, fileType){
			var serviceApi = './api/file?capabilityId='+capabilityId+'&fileType='+fileType;
			console.log("calling:" + serviceApi);
			return $http.get(serviceApi).then(function (response) {
			    console.log(response);
			    return response;
			});
		}

		/*
 			Checks whether the output files are ready for each cababilities
		*/
		function isAvailToDownload(capability, projectId){
			var serviceApi;
			if (capability === "diagnostics"){
				serviceApi = './api/diagnostic/' + projectId;
				console.log("calling: " + serviceApi);
			}
			else if (capability === "cdt"){
				serviceApi = './api/decisiontree/' + projectId;
				console.log("calling: " + serviceApi);
			}
			else if (capability === "storeclustering"){
				serviceApi = './api/storeclustering/' + projectId;
				console.log("calling: " + serviceApi);
			}
			else if (capability === "loyalty"){
				serviceApi = './api/loyalty/' + projectId;
				console.log("calling: " + serviceApi);
			}
			else if (capability === "substitution"){
				serviceApi = './api/substitution/' + projectId;
				console.log("calling: " + serviceApi);
			}
			else{
				console.log("Does not recognize capability");
				return false;
			}

			return $http.get(serviceApi).then(function (response){
				return response;
			});
		}

		/*
			Get all the available assortments
		*/
		function getAssortments() {
			var serviceApi = './api/assortmentAnalysis/';
			return $http.get(serviceApi).then(function (response) {
				return response;
			});
		}

		function dlTemplate(templateName) {
			console.log("calling service to get template");
			var myTemplate = templateName;
			var templateApi = './api/Template?templateName='+myTemplate;
			return $http.get(templateApi).then(function (response) {
			    console.log(response);
			    return response;
			});
		}

		/*
		 * save to a file a chunk of text
		 */
		function saveTemplate(mydata, templateName){
			var blob = new Blob([mydata], { type: "text/plain;charset=utf-8" });
			var downloadLink = document.createElement("a");
			downloadLink.download = templateName;
			downloadLink.innerHTML = "Download File";
			if (window.URL !== null) {   //for chrome
				downloadLink.href = window.URL.createObjectURL(blob);
			}
			else {  //firefox must add link to the DOM
				downloadLink.href = window.URL.createObjectURL(blob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}
			downloadLink.click();
		}

		function addAssortment(assortment) {
			var serviceApi = './api/assortmentAnalysis';
			console.log("Calling post with these info: " + assortment.assortname+":"+assortment.departmentnumber+":"+assortment.rollupid);
			var assortrequest = {
				method: 'POST',
				url: serviceApi,
				data: {
					Name: assortment.assortname,
					Department: assortment.departmentnumber,
					RollUpTypeCode: assortment.rollupid,
					ItemList: assortment.fileData
				}
			};

			return $http(assortrequest).then(function (response) {
					return response;
			});
		}

		function createYulesQ(cdt) {
			console.log("Calling service to create YulesQ");
			var cdtRequest = {
			    method: 'POST',
			    url: './api/decisiontree/' + cdt.assortmentId,
			    data: {
			        AssortmentId: cdt.assortmentId
			    }
			};

			return $http(cdtRequest).then(function (response) {
			    return response;
			});
		}

		function getDecisionTree(assortmentId) {
		    console.log("Calling service to get loyalty");
		    var serviceApi = './api/decisiontree/' + assortmentId;
		    return $http.get(serviceApi).then(function (response) {
		        return response;
		    });
		}


		function getDiagnostics(assortmentId) {
		    console.log("Calling service to get diagnostis");
		    var serviceApi = './api/diagnostic/' + assortmentId;
		    return $http.get(serviceApi).then(function (response) {
		        return response;
		    });
		}

		function createLoyalty(loyalty) {
		    console.log("Calling service to create loyalty");
		    var serviceApi = './api/loyalty/' + loyalty.assortmentId;
		    var loyaltyRequest = {
		        method: 'POST',
		        url: serviceApi,
		        data: {
                    AssortmentId: loyalty.assortmentId,
		            LoyaltyLevel: loyalty.loyaltyLevel,
		            UseClustering: loyalty.useClustering,
		            ItemList: loyalty.itemList,
		            StoreClustering: loyalty.storeClustering
		        }
		    };

		    return $http(loyaltyRequest).then(function (response) {
		        return response;
			});
		}

		function getLoyalty(assortmentId) {
		    console.log("Calling service to get loyalty");
		    var serviceApi = './api/loyalty/' + assortmentId;
		    return $http.get(serviceApi).then(function (response) {
		        return response;
		    });
		}

		function createStoreClustering(cluster) {
			console.log("Calling service to create store clustering");
			var serviceApi = './api/storeclustering/' + cluster.assortmentId;
			var clusteringRequest = {
			    method: 'POST',
			    url: serviceApi,
			    data: {
			        AssortmentId: cluster.assortmentId,
			        StoreList: cluster.storeList
			    }
			};

			return $http(clusteringRequest).then(function (response) {
			    return response;
			});
		}

		function getStoreClustering(assortmentId) {
		    console.log("Calling service to get store clustering");
		    var serviceApi = './api/storeclustering/' + assortmentId;
		    return $http.get(serviceApi).then(function (response) {
		        return response;
		    });
		}

		function createSubstitution(sub) {
			console.log("Calling service to create substitution");
			var serviceApi = './api/substitution/' + sub.assortmentId;
			var subRequest = {
			    method: 'POST',
			    url: serviceApi,
			    data: {
			        AssortmentId: sub.assortmentId,
			        ItemList: sub.itemList
			    }
			};

			return $http(subRequest).then(function (response) {
			    return response;
			});
		}

		function getSubstitution(assortmentId) {
		    console.log("Calling service to get loyalty");
		    var serviceApi = './api/substitution/' + assortmentId;
		    return $http.get(serviceApi).then(function (response) {
		        return response;
		    });
		}

		function downloadCapabilityFiles(capabilityId, fileType, fileName){
            getCapabilityFiles(capabilityId, fileType).then(function (response) {
                var rc = response.status;
                if (rc === 200 || rc === 201){
                    var mydata = response.data;
                    var blob = new Blob([mydata], { type: "text/plain;charset=utf-8" });

                    var downloadLink = document.createElement("a");
                    downloadLink.download = fileName;
                    downloadLink.innerHTML = "Download File";
                    if (window.URL !== null) {   //for chrome
                        downloadLink.href = window.URL.createObjectURL(blob);
                    }
                    else {  //firefox must add link to the DOM
                        downloadLink.href = window.URL.createObjectURL(blob);
                        downloadLink.onclick = destroyClickedElement;
                        downloadLink.style.display = "none";
                        document.body.appendChild(downloadLink);
                    }
                    downloadLink.click();
                }else{
                    vm.ErrorTextAlert = "Service return error: " + rc;
                    vm.isDisabled = true;
                    vm.showErrorAlert = true;
                }
            });

        }

		function handleError(response, status, headers, config) {
			// The API response from the server should be returned in a
			// normalized format. However, if the request was not handled by the
			// server (or what not handles properly - ex. server error), then we
			// may have to normalize it on our end, as best we can.
			if (!angular.isObject(response.data) || !response.data.message) {
				return ($q.reject('An unknown error occurred.'));
			}

			// Otherwise, use expected error message.
			return ($q.reject(response.data.message));
		}
	}
})();
