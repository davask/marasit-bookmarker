var dwlApp = angular.module('dwlApp', []);

dwlApp.controller('dwlPagination', function ($scope, $log) {
  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
}).factory("bookMarker", [function() {

    return new chromeBookmarker({init:true});

}]).directive("repeatComplete",function( $rootScope ) {
    // source : http://www.bennadel.com/blog/2592-hooking-into-the-complete-event-of-an-ngrepeat-loop-in-angularjs.htm
    var uuid = 0;
    function compile( tElement, tAttributes ) {
        var id = ++uuid;
        tElement.attr( "repeat-complete-id", id );
        tElement.removeAttr( "repeat-complete" );
        var completeExpression = tAttributes.repeatComplete;
        var parent = tElement.parent();
        var parentScope = ( parent.scope() || $rootScope );
        var unbindWatcher = parentScope.$watch(function() {
            console.info( "Digest running." );
            var lastItem = parent.children( "*[ repeat-complete-id = '" + id + "' ]:last" );
            if ( ! lastItem.length ) {
                return;
            }
            var itemScope = lastItem.scope();
            if ( itemScope.$last ) {
                unbindWatcher();
                itemScope.$eval( completeExpression );
            }
        });
    }
    return({
        compile: compile,
        priority: 1001,
        restrict: "A"
    });
}).controller("dwlCtrl", ['$scope', 'bookMarker', function ($scope, bookMarker) {

    var b = bookMarker.bookmarks;

    // $scope.orderProp = 'title';
    $scope.bookmarks = [{}];

    $scope.initBookmark = function(){

        console.log('initBookmark',b.unique_urls_id);

        for (var i = 0; i < b.unique_urls_id.length; i++) {

            $scope.bookmarks.push({id:b.unique_urls_id[i]});
            // chrome.bookmarks.get(b.unique_urls_id[i], function (result) {
            //     $scope.$watch(function(){
            //         $scope.bookmarks.push(result[0]);
            //     });
            // });
            // if (((i+1) % 100) == 0) {
            //     $scope.$apply();
            // }
        }

    };

}]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
};
console.log('dwl-controller.js loaded');