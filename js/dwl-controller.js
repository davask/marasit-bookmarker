var dwlApp = angular.module('dwlApp', []);

dwlApp.factory("bookMark", ['$window',  function($window) {

    $window['dwlBk'] = new chromeBookmarker({init:true});

    return {
        get: function(offset, limit) {
          return $window.dwlBk.bookmarks.unique_urls_id.slice(offset, offset+limit);
        },
        total: function() {
            return $window.dwlBk.bookmarks.unique_count
        }
    };

}]).controller("dwlCtrl", ['$scope','$window', 'bookMark', function ($scope, $window, bookMark) {

    $scope.bookmarkPerPage = $window.dwlBk.settings.limit;
    $scope.currentPage = $window.dwlBk.settings.page;
    $scope.orderProp = 'title';

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

      $scope.$watch("currentPage", function(newValue, oldValue) {
        console.log(bookMark.get(newValue, $scope.bookmarkPerPage));
        $window.dwlBk.getPagedBookmarksFromChromeBookmarks(newValue).done(function(){
            $scope.apply(function(){
                console.log($window.dwlBk.allBookmarks);
                $scope.bookmarks = $window.dwlBk.allBookmarks;
            });
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