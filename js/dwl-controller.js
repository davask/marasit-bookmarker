var dwlApp = angular.module('dwlApp', []);

dwlApp.controller('dwlCtrl', ['$scope','$window',function ($scope, $window) {

        $window['dwlBk'] = $window.dwlBookmarker;
        $window.dwlBk.retrieve();
        $scope.bookmarks= [];

        $window.dwlBk.getAllUniqueBookmarksFromChromeBookmarks().done(function(){
            $scope.$apply(function () {
                $scope.quantity = 5;
                $scope.orderProp = 'title';
                $scope.bookmarks = $window.dwlBk.allBookmarks;
            });
        });

}]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
};
