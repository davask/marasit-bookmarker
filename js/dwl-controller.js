var dwlApp = angular.module('dwlApp', ['ui.bootstrap']);

dwlApp.factory("bookMarker", function() {

    return chrome.extension.getBackgroundPage().dwlBk;

}).directive("repeatComplete",function( $rootScope ) {
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
}).filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
}).controller("dwlCtrl", ['$scope', 'bookMarker', '$log', '$timeout', function ($scope, bookMarker, $log, $timeout) {

    jQuery('.dwlLoading').show();

    $scope.bookmarks = [{}];

    $scope.totalItems = bookMarker.bookmarks.unique_count;
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.bookmarks = bookMarker.allBookmarks;
    $scope.numPages = Math.ceil($scope.bookmarks.length/$scope.maxSize);

    $scope.orderProp = 'title';
    $scope.entryLimit = "10";

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.hideLoading = function () {
        jQuery('.dwlLoading').hide();
    };

    $scope.filter = function() {
        $timeout(function() {
            //wait for 'filtered' to be changed
            /* change pagination with $scope.filtered */
            $scope.totalItems = $scope.filtered.length;
            $scope.numPages = Math.ceil($scope.filtered.length/parseInt($scope.entryLimit,10));

            if ($scope.numPages < $scope.maxSize) {
                $scope.maxSize = $scope.numPages;
            }

        }, 10);
    };

    $scope.initBookmark = function () {
        jQuery('.dwlLoading').hide();
        console.log('initBookmark');
    };

    $scope.initBookmark();

}]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
};