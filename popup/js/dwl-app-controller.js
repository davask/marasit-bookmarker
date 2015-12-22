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

    $rootScope.updateRoute = function(route) {
        $rootScope.route = route;
        $rootScope.updateRouting();
    }

    $rootScope.updateRouting = function() {
       _this.$location.path(routesService.defaultRoutes[$rootScope.activity][$rootScope.route].path);
    }

    $rootScope.updateActivity = function() {
        $rootScope.activity = $scope.activity;
        $rootScope.routes = [];
        $rootScope.routes = routesService.routes($scope.activity);

        if ($rootScope.activity == 'todo') {
            $rootScope.initTodo();
        } else {
            $rootScope.initBookmark();
        }
    }

    $rootScope.initTodo = function () {
        $rootScope.updateRoute('todo');
    };

    $rootScope.initBookmark = function () {

        $rootScope.updateRoute('unique');

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

    $rootScope.updateActivity();

}]);

/* -------------------------------------- */
/* -------BOOKMARKS----------- */
/* -------------------------------------- */
dwlApp.controller("dwlCommonCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$filter', 'routesService', 'bookmarkService', '$q', '$log',
                                      function ($route, $routeParams, $location,$rootScope, $scope,$filter,routesService,bookmarkService,$q,$log) {

    var _this = this;

    $rootScope.name = "All bookmarks";
    $rootScope.params = $routeParams;

    $scope.bkPagination = 'bookmarks';

    $scope.bkToWatch = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksIds;
    $scope.isBkObject = false;

    $scope.bkIds = function(newValue, oldValue){
        return newValue;
    }

    $scope.currentPage = 0;
    $scope.pageSize = 10;

    $scope.numberOfBookmarks = function () {
        return $scope[$scope.bkPagination].length;
    };

    $scope.numberOfPages=function(){
        return Math.ceil($scope.numberOfBookmarks()/$scope.pageSize);
    }

    $scope.getPathTree=function(id){
        var allBks = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
        return bookmarkService.getParentTree(allBks, id);
    }

    $scope.getAlternativePathsTree=function(id){
        var allBks = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
        return bookmarkService.getAlternativesTree(allBks, id);
    }

    $scope.setPathTree=function(id, index){
        var allBks = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
        console.log(allBks[id].paths[index]);
    }

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return $scope.bkToWatch;

    }, function(newValue, oldValue) {

        $rootScope.chromeBookmarksIds = [];

        $rootScope.chromeBookmarksIds = $scope.bkIds(newValue, oldValue);

        $rootScope.chromeBookmarks = [];
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks[$rootScope.chromeBookmarksIds[i]];
            bookmark['duplicate'] = [];
            if(typeof(bookmark.url) != 'undefined') {
                bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
            }
            $rootScope.chromeBookmarks.push(bookmark);
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    },$scope.isBkObject);

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

dwlApp.controller("dwlAllCtrl", ['$controller', '$rootScope', '$scope',
                                      function ($controller,$rootScope, $scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    /* all bookmarks pagination */
    $scope.filter = {
        'type' : 'all'
    };

}]);

dwlApp.controller("dwlUniqueCtrl", ['$controller', '$rootScope', '$scope',
                                      function ($controller,$rootScope, $scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    $rootScope.name = "Unique bookmarks";
    $scope.bkToWatch = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls;
    $scope.isBkObject = true;

    $scope.bkIds = function(newValue, oldValue){
        var ids = [];
        for (var url in newValue) {
            ids.push(newValue[url][0]);
        }
        return ids;
    }

}]);

dwlApp.controller("dwlFolderCtrl", ['$controller', '$rootScope', '$scope',
                                      function ($controller,$rootScope, $scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    $rootScope.name = "Folder bookmarks";
    $scope.bkToWatch = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksFolders;

}]);

dwlApp.controller("dwlDuplicateCtrl", ['$controller', '$rootScope', '$scope',
                                      function ($controller,$rootScope, $scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    $scope.bkPagination = 'chromeBookmarks';

    $rootScope.name = "Duplicate bookmarks";
    $scope.bkToWatch = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksDuplicate;

}]);

dwlApp.controller("dwlUntaggedCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    $rootScope.name = "Untagged bookmarks";
    $rootScope.params = $routeParams;

}]);


/* -------------------------------------- */
/* -----------TODOS---------------- */
/* -------------------------------------- */
dwlApp.controller("dwlTodoCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    $rootScope.name = "Todos";
    $rootScope.params = $routeParams;

}]);
