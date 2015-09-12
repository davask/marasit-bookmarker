var dwlApp = angular.module('dwlApp', []);

dwlApp.factory("bookMark", ['$q','$window',  function($q, $window) {

    $window['dwlBk'] = new chromeBookmarker({init:true});

    return {
        items : [],
        getPartial : function() {

            var deferred = $q.defer();

            $window.dwlBk.getPagedBookmarksFromChromeBookmarks(0).done(function(){
                deferred.resolve($window.dwlBk.allBookmarks);
            });

            return deferred.promise;
        },
        getAll : function() {

            var deferred = $q.defer();

            $window.dwlBk.getAllUniqueBookmarksFromChromeBookmarks().done(function(){
                deferred.resolve($window.dwlBk.allBookmarks);
            });

            return deferred.promise;
        },
        get: function(offset, limit) {
          return this.items.slice(offset, offset+limit);
        },
        total: function() {
            return $window.dwlBk.bookmarks.unique_count
        }

    };

}]).controller("dwlCtrl", ['$scope','$window', 'bookMark', function ($scope, $window, bookMark) {

    $scope.bookmarkPerPage = $window.dwlBk.settings.limit;
    $scope.currentPage = $window.dwlBk.settings.page;
    $scope.orderProp = 'title';
    $scope.bookmarks = [];

    $scope.range = function() {
        var rangeSize = 5;
        var ret = [];
        var start;

        start = $scope.currentPage;
        if ( start > $scope.pageCount()-rangeSize ) {
        start = $scope.pageCount()-rangeSize;
        }

        for (var i=start; i<start+rangeSize; i++) {
        ret.push(i);
        }
        return ret;
        };

        $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
        $scope.currentPage--;
        }
    };

    $scope.prevPageDisabled = function() {
        return $scope.currentPage === 0 ? "disabled" : "";
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pageCount() - 1) {
          $scope.currentPage++;
        }
    };

    $scope.nextPageDisabled = function() {
        return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.total/$scope.bookmarkPerPage);
    };

    bookMark.getPartial(0).then(function(result) {
        bookMark.items = result;
        console.log('partial',bookMark.items.length);

        $scope.$watch("currentPage", function(newValue, oldValue) {
            $scope.bookmarks = bookMark.get(newValue, $scope.bookmarkPerPage);
            $scope.total = bookMark.total();
        });
    });



}]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
};
console.log('dwl-controller.js loaded');