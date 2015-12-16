dwlApp.controller("appCtrl", ['TITLE','AUTHOR',
                                  function (TITLE,AUTHOR) {
    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;
}]);

dwlApp.controller("dwlInitCtrl", ['$route', '$routeParams', '$location','$rootScope','$scope','routesService','activityService','$log',
                                      function ($route, $routeParams, $location,$rootScope,$scope,routesService,activityService,$log) {
    var _this = this;

    _this.$route = $route;
    _this.$location = $location;
    _this.$routeParams = $routeParams;

    $rootScope.activities = activityService.activities;
    $rootScope.activity = 'bookmark';

    $rootScope.updateActivity = function() {
       $log.log('updateActivity',$rootScope);
        // if ($rootScope.activity == 'bookmark') {
        //     $rootScope.initBookmark();
        // }
    }

    $rootScope.initBookmark = function () {

    $rootScope.routes = routesService.routes;
    $rootScope.route = 'unique';

        $rootScope.updateRoute = function(route) {
            $rootScope.route = route;
            $rootScope.updateRouting();
        }

        $rootScope.updateRouting = function() {
           $location.path(routesService.defaultRoutes[$scope.route].path);
        }

        $rootScope.count = {
            'all': function () {
                return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksIds.length
            },
            'folder': function () {
                return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksFolders.length
            },
            'unique': function () {
                return Object.keys(chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls).length
            },
            'duplicate': function () {
                return this.all() - this.folder() - this.unique();
            },
            'untagged': function () {
                return 0;
            }
        };
    };

    $rootScope.initBookmark();


}]);

dwlApp.controller("dwlAllCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$filter', 'routesService', 'bookmarkService', '$q', '$log',
                                      function ($route, $routeParams, $location,$rootScope, $scope,$filter,routesService,bookmarkService,$q,$log) {
    var _this = this;

    _this.name = "All bookmarks";
    _this.params = $routeParams;

    /* all bookmarks pagination */
    $scope.filter = {
        'type' : 'all'
    };

    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfBookmarks = function () {
        return $scope.bookmarks.length;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.numberOfBookmarks()/$scope.pageSize);
    }

    $scope.getPathTree=function(id){
        return bookmarkService.getParentTree(chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks, id);
    }

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksIds;

    }, function(newValue, oldValue) {
        $rootScope.chromeBookmarksIds = newValue;

        $rootScope.chromeBookmarks = [];
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks[$rootScope.chromeBookmarksIds[i]];
            bookmark['duplicate'] = []
            if(typeof(bookmark.url) != 'undefined') {
                bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
            }
            $rootScope.chromeBookmarks.push(bookmark);
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    },true);

    /* assign saved bookmarks details to scope*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarksDetails = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return $rootScope.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarks = newValue;
    });

}]);

dwlApp.controller("dwlUniqueCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$filter', 'bookmarkService', '$q', '$log',
                                      function ($route, $routeParams, $location,$rootScope, $scope,$filter,bookmarkService,$q,$log) {
    var _this = this;

    _this.name = "All bookmarks";
    _this.params = $routeParams;

    /* all bookmarks pagination */
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfBookmarks = function () {
        return $scope.bookmarks.length;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.numberOfBookmarks()/$scope.pageSize);
    }

    $scope.getPathTree=function(id){
        return bookmarkService.getParentTree(chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks, id);
    }

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls;

    }, function(newValue, oldValue) {
        $rootScope.chromeBookmarksIds = [];
        for (var url in newValue) {
            $rootScope.chromeBookmarksIds.push(newValue[url][0]);
        }

        $rootScope.chromeBookmarks = [];
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks[$rootScope.chromeBookmarksIds[i]];
            bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
            $rootScope.chromeBookmarks.push(bookmark);
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    },true);

    /* assign saved bookmarks details to scope*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarksDetails = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return $rootScope.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarks = newValue;
    });

}]);

dwlApp.controller("dwlUntaggedCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    _this.name = "Untagged bookmarks";
    _this.params = $routeParams;

}]);

dwlApp.controller("dwlFolderCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    _this.name = "Folder bookmarks";
    _this.params = $routeParams;

    /* all bookmarks pagination */
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfBookmarks = function () {
        return $scope.bookmarks.length;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.numberOfBookmarks()/$scope.pageSize);
    }

    $scope.getPathTree=function(id){
        return bookmarkService.getParentTree(chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks, id);
    }

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksFolders;

    }, function(newValue, oldValue) {
        $rootScope.chromeBookmarksIds = newValue;

        $rootScope.chromeBookmarks = [];
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks[$rootScope.chromeBookmarksIds[i]];
            bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
            $rootScope.chromeBookmarks.push(bookmark);
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    });

    /* assign saved bookmarks details to scope*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarksDetails = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return $rootScope.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarks = newValue;
    });

}]);

dwlApp.controller("dwlDuplicateCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    _this.name = "Duplicate bookmarks";
    _this.params = $routeParams;

    /* all bookmarks pagination */
    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfBookmarks = function () {
        return $scope.chromeBookmarks.length;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.numberOfBookmarks()/$scope.pageSize);
    }

    $scope.getPathTree=function(id){
        return bookmarkService.getParentTree(chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks, id);
    }

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksDuplicate;

    }, function(newValue, oldValue) {
        $rootScope.chromeBookmarksIds = newValue;

        $rootScope.chromeBookmarks = [];
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks[$rootScope.chromeBookmarksIds[i]];
            bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
            $rootScope.chromeBookmarks.push(bookmark);
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    },true);

    /* assign saved bookmarks details to scope*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarksDetails = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return $rootScope.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarks = newValue;
    });

}]);

