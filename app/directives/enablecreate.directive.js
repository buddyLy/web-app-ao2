(function(){
	'use strict';

	angular
		.module('AssortmentOptimization.Directives')
		.directive('enableCreate', enableCreate)
		.directive('disableCreate', disableCreate);

	enableCreate.$inject = [];
	disableCreate.$inject = [];

	function enableCreate(){
		return {
			restrict: 'EA',
			link: function(scope, element, attrs){
				element.bind('change', function(event){
					debugger;
					var files = event.target.files;
            		//iterate files since 'multiple' may be specified on the element
					for (var i = 0;i<files.length;i++) {
						//emit event upward
						scope.$emit("fileSelected", { file: files[i] });
            		} 
					scope.$apply(function(){
						debugger;
						if (files.length > 0){
							scope.isFileChosen = true; 
						}
					});
				});
			}
		};
	}

	function disableCreate(){
		return {
			restrict: 'EA',
			link: function(scope, element, attrs){
				element.bind('change', function(){
					scope.$apply(function(){
						debugger;
						scope.isFileChosen = false; 
					});
				});
			}
		};
	}
})();
