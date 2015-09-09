var dwlApp = angular.module('dwlApp', []);

dwlApp["getScope"] = function (e) {
    var controllerElement = document.querySelector('body');
    var controllerScope = angular.element(controllerElement).scope();
    return controllerScope;
}

dwlApp.controller('dwlCtrl', [
    '$scope',
    '$window',
    function ($scope, $window) {
        $scope.typeOf = function(val) {
            return typeof val;
        };
        $scope.dwl = $window.dwl;
        $scope.orderProp = 'id';
        $scope.quantity = 10;
    }
]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
}
