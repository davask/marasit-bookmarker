dwlApp.controller("appCtrl", ['TITLE','AUTHOR',
                                  function (TITLE,AUTHOR) {
    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;
}]);

/* -------------------------------------- */
/* -----------POPUP --------------- */
/* -------------------------------------- */
dwlApp.controller("dwlInitCtrl", ['$route', '$routeParams', '$location','$rootScope','$scope','$q','routesService','activityService','$log',
                                      function ($route, $routeParams, $location,$rootScope,$scope,$q,routesService,activityService,$log) {
    var _this = this;

    $rootScope.$route = $route;
    $rootScope.$location = $location;
    $rootScope.$routeParams = $routeParams;

    $rootScope.activities = activityService.activities;
    $rootScope.activity = 'bookmark';

    $rootScope.updateRoute = function(route) {
       $rootScope.route = route;
       $rootScope.changeRoute();
    }

    $rootScope.updateRouting = function() {
       $rootScope.route = $scope.route;
       $rootScope.changeRoute();
    }

    $rootScope.changeRoute = function() {
        $rootScope.query = '';
        $rootScope.queryTag = '';
        $rootScope.queryNoTag = '';
       $rootScope.$location.path(routesService.defaultRoutes[$rootScope.activity][$rootScope.route].path);
    }

    $rootScope.updateActivity = function() {

        $rootScope.activity = $scope.activity;
        $rootScope.routes = [];
        $rootScope.routes = routesService.routes($scope.activity);

        if ($rootScope.activity == 'todo') {
            $rootScope.initTodo();
        } else if ($rootScope.activity == 'timer') {
            $rootScope.initTimer();
        } else {
            $rootScope.initBookmark();
        }
    }

    $rootScope.initTodo = function () {
        $rootScope.updateRoute('todo');
    };

    $rootScope.initTimer = function () {
        $rootScope.updateRoute('timer');
    };

    $rootScope.initBookmark = function () {

        var route = 'page';
        var id = null;

        $rootScope.dwlBk = chrome.extension.getBackgroundPage().dwlBk;

        if($rootScope.dwlBk.tab.url == '') {
            route = 'unique';
        }
        if($rootScope.dwlBk.bookmarks.length > 0) {
            route = 'unique';
            id = $rootScope.dwlBk.bookmarks[0].id
        }
        if($rootScope.dwlBk.bookmarks.length > 1) {
            route = 'duplicate';
            id = $rootScope.dwlBk.bookmarks[1].id
        }

        $rootScope.updateRoute(route);

        $rootScope.refreshAllBookmarks().then(function(){
            $rootScope.resetBookmarksCount();

            if(id !== null ) {
                $rootScope.query = $rootScope.dwlBk.chromeBk.chromeBookmarks[id].titleNoTag;
            }
        });

    };

    $rootScope.resetBookmarksCount = function () {

        // $rootScope.dwlBk = chrome.extension.getBackgroundPage().dwlBk;

        $rootScope.count = {
            'all': $rootScope.dwlBk.chromeBk.chromeBookmarksIds.length,
            'page': $rootScope.dwlBk.bookmarks.length,
            'folder': $rootScope.dwlBk.chromeBk.chromeBookmarksFolders.length,
            'unique': Object.keys($rootScope.dwlBk.chromeBk.chromeBookmarksUrls).length,
            'duplicate': $rootScope.dwlBk.chromeBk.chromeBookmarksDuplicate.length,
            'untagged': 0
        };
    };

    $rootScope.resetAllBookmarks = function(){
        var deferred = $q.defer();
        $rootScope.dwlBk.chromeBk.reInitAllBookmarksAsArray().then(function(){
            deferred.resolve();
        });
        return deferred.promise;
    };

    $rootScope.refreshAllBookmarks = function(){
        var deferred = $q.defer();
        $rootScope.dwlBk.chromeBk.reLoadAllBookmarksAsArray().then(function(){
            $rootScope.dwlBk.chromeBk.setIcon($rootScope.dwlBk.id, $rootScope.dwlBk.bookmarks);
            deferred.resolve();
        });
        return deferred.promise;
    };

    $rootScope.filterTag = function(value) {
        if (value == 'no-tag') {
            $rootScope.query = '';
            $rootScope.queryNoTag = value;
        } else {
            $rootScope.query = value;
            $rootScope.queryNoTag = '';
        }
    };

    $rootScope.updateActivity();

}]);

/* -------------------------------------- */
/* -------BOOKMARKS----------- */
/* -------------------------------------- */
dwlApp.controller("dwlCommonCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$filter', 'routesService', 'bookmarkService', '$q', '$timeout', '$log',
                                      function ($route, $routeParams, $location,$rootScope, $scope,$filter,routesService,bookmarkService,$q,$timeout,$log) {

    var _this = this;

    // $rootScope.dwlBk.chromeBk = chrome.extension.getBackgroundPage().dwlBk.chromeBk;
    // $rootScope.dwlBk.chromeBk.tagBk = $rootScope.dwlBk.chromeBk.tagBk;

    $rootScope.name = "All bookmarks";
    $rootScope.params = $routeParams;

    $scope.bkPagination = 'bookmarks';

    $scope.bkToWatch = $rootScope.dwlBk.chromeBk.chromeBookmarksUrls;
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
        var allBks = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarks;
        return bookmarkService.getParentTree(allBks, id);
    }

    $scope.getAlternativePathsTree=function(id){
        var allBks = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarks;
        return bookmarkService.getAlternativesTree(allBks, id);
    }

    $scope.setPathTree=function(id, index){
        var allBks = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarks;
        // console.log(allBks[id].paths[index]);
    }

    $scope.removeBookmark = function(id){
        $rootScope.query = $rootScope.dwlBk.chromeBk.chromeBookmarks[id].titleNoTag;

        $rootScope.dwlBk.chromeBk.removeChromeBookmarks(id).then(function(){

            $scope.refreshDisplayBookmarks();

        });
    };

    $scope.generateBookmark = function() {
        chrome.tabs.getSelected(null, function(tab) {
            $rootScope.dwlBk.show(tab.id).then(function() {
                $rootScope.resetBookmarksCount();
            });
        });

        // jQuery('.glyphicon[data-lazy]').each(function(){
        //     if (jQuery(this).attr('data-lazy') != '') {
        //         jQuery(this).css({
        //             'background-image':'url("'+jQuery(this).attr('data-lazy')+'"), url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z")'
        //         });
        //     }
        // });

    };

    $scope.editTag = function(event) {

        var updateTags = false;
        var id = jQuery(event.target).parents('ul').attr('id');
        var value = jQuery(event.target).val().trim();
        var oldvalue = jQuery(event.target).attr('data-oldvalue').trim();
        var b = $rootScope.dwlBk.chromeBk.chromeBookmarks[id];

        var tagIndex = parseInt(jQuery.inArray(oldvalue, b.tags),10);
        $rootScope.query = b.titleNoTag;

        if (value == '' && tagIndex > -1) { /* delete tags */

            b.tags.clean(oldvalue);
            $rootScope.dwlBk.chromeBk.cleanTags(oldvalue, b.id);

            updateTags = true;

        } else if (value != '' && value != oldvalue && tagIndex > -1) { /* update tags */

            $rootScope.dwlBk.chromeBk.cleanTags(oldvalue, b.id);

            var allValues = value.match(new RegExp($rootScope.dwlBk.chromeBk.tagBk.regexEachTags($rootScope.dwlBk.chromeBk.tagBk.tagRegexSep.join('')),'g'));
            allValues.clean("");

            for (var i = 0; i < allValues.length; i++) {
                if (jQuery.inArray(allValues[i], b.tags) >= 0) {
                    b.tags[tagIndex] = allValues[i];
                    $rootScope.dwlBk.chromeBk.addTags(allValues[i], b.id);
                } else {
                    b.tags.push(allValues[i]);
                    $rootScope.dwlBk.chromeBk.addTags(allValues[i], b.id);
                }
            };

            b.tags = b.tags.unique();

            updateTags = true;

        } else if (value != '' && value != oldvalue && tagIndex < 0) { /* add tags */

            var allValues = value.match(new RegExp($rootScope.dwlBk.chromeBk.tagBk.regexEachTags($rootScope.dwlBk.chromeBk.tagBk.tagRegexSep.join('')),'g'));
            allValues.clean("");

            for (var i = 0; i < allValues.length; i++) {
                if (jQuery.inArray(allValues[i], b.tags) < 0) {
                    b.tags.push(allValues[i]);
                    $rootScope.dwlBk.chromeBk.addTags(allValues[i], b.id);
                }
            };

            b.tags = b.tags.unique();
            updateTags = true;

        }

        b.tags = $rootScope.dwlBk.chromeBk.tagBk.getBookmarkTags('['+b.tags.join(' ')+'] '+b.titleNoTag);

        if (updateTags) {
            $rootScope.dwlBk.chromeBk.storage.setItem('chromeBookmarksTags', JSON.stringify($rootScope.dwlBk.chromeBk.chromeBookmarksTags));
            $rootScope.dwlBk.chromeBk.storage.setItem('chromeBookmarksTagsIds', JSON.stringify($rootScope.dwlBk.chromeBk.chromeBookmarksTagsIds));
        }

        b.tags = $rootScope.dwlBk.chromeBk.tagBk.getBookmarkTags('['+b.tags.join(' ')+'] '+b.titleNoTag);
        b['tagsToDisplay'] = [];
        for (var i = 0; i < b.tags.length; i++) {
            b['tagsToDisplay'].push({ 'tag': b.tags[i] });
        };
        b = $rootScope.dwlBk.chromeBk.tagBk.setTitleBasedOnTag(b);
        $rootScope.dwlBk.chromeBk.updateChromeBookmarksTitle(b).then(function(){
            jQuery('#'+id+' [ng-repeat-end] input').val('').attr({'data-oldvalue':''});
        });

        // $scope.refreshDisplayBookmarks();

        // clean latest tag input

    };

    $scope.editUrl = function(event) {

        var id = jQuery(event.target).attr('id').replace('-url','');
        var value = jQuery(event.target).val();
        var b = $rootScope.dwlBk.chromeBk.chromeBookmarks[id];

        if(value != '' && isUrl(value)) {
            b.url = value;
            $rootScope.dwlBk.chromeBk.updateChromeBookmarksUrl(b);
        }

        $scope.generateBookmark();

    };

    $scope.editTitleNoTag = function(event) {

        var id = jQuery(event.target).attr('id').replace('-titlenotag','');
        var value = jQuery(event.target).val();
        var b = $rootScope.dwlBk.chromeBk.chromeBookmarks[id];

        if(value != '') {
            b.titleNoTag = value;
            b = $rootScope.dwlBk.chromeBk.tagBk.setTitleBasedTitleNoTag(b);
            $rootScope.dwlBk.chromeBk.updateChromeBookmarksTitle(b);
        }

        $scope.generateBookmark();

    };

    $scope.refreshDisplayBookmarks = function(){
        var deferred = $q.defer();

        $rootScope.refreshAllBookmarks().then(function(){

            if ($rootScope.route == 'duplicate') {
                $scope.bkToWatch = $rootScope.dwlBk.chromeBk.chromeBookmarksDuplicate;
            } else if ($rootScope.route == 'unique') {
                $scope.bkToWatch = $rootScope.dwlBk.chromeBk.chromeBookmarksUrls;
            } else {
                $scope.generateBookmark();
            }
            $rootScope.resetBookmarksCount();
            deferred.resolve();
        });

        return deferred.promise;
    };

    $scope.openChromeBookmarksPanel = function (string) {
        chrome.tabs.create({url: "chrome://bookmarks/#q="+string})
    };

    /* assign unique urls bookmarks to scope */
    $scope.$watch(function() {

        return $scope.bkToWatch;

    }, function(newValue, oldValue) {

        $rootScope.chromeBookmarksIds = [];

        $rootScope.chromeBookmarksIds = $scope.bkIds(newValue, oldValue);

        $rootScope.chromeBookmarks = [];
        var bookmarks = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarks;
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = null;
            if (typeof(bookmark = bookmarks[$rootScope.chromeBookmarksIds[i]]) != "undefined") {
                bookmark['duplicate'] = [];
                if(typeof(bookmark.url) != 'undefined') {
                    bookmark['duplicate'] = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksUrls[bookmark.url];
                }
                $rootScope.chromeBookmarks.push(bookmark);
            }
        };
        chrome.browserAction.setBadgeText({text:""+Object.keys($rootScope.chromeBookmarks).length});

    },$scope.isBkObject);

    /* assign saved bookmarks details to scope*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarksDetails = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return $rootScope.chromeBookmarks;
    }, function(newValue, oldValue) {
        $scope.chromeBookmarks = newValue;
    });

    /* assign scope bookmarks*/
    $scope.$watch(function() {
        return chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksTagsIds;
    }, function(newValue, oldValue) {
        $rootScope.allTagsIds = newValue;
        $rootScope.allTags = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksTags;
    },true);

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
    $scope.bkToWatch = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksUrls;
    $scope.isBkObject = true;

    $rootScope.allTags = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksTags;
    $rootScope.allTagsIds = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksTagsIds;

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
    $scope.bkToWatch = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksFolders;

}]);

dwlApp.controller("dwlDuplicateCtrl", ['$controller', '$rootScope', '$scope',
                                      function ($controller,$rootScope, $scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    $scope.bkPagination = 'chromeBookmarks';

    $rootScope.name = "Duplicate bookmarks";
    $scope.bkToWatch = chrome.extension.getBackgroundPage().dwlBk.chromeBk.chromeBookmarksDuplicate;

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

/* -------------------------------------- */
/* -----------TIMER ---------------- */
/* -------------------------------------- */
dwlApp.controller("dwlTimerCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    $rootScope.name = "Timer";
    $rootScope.params = $routeParams;

    $scope.timerRunning = false;

    $scope.startTimer = function (){
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.resumeTimer = function (){
        $scope.$broadcast('timer-resume');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function (){
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };

    $scope.$on('timer-stopped', function (event, args) {
        // console.log('timer-stopped args = ', args);
    });

}]);

/* -------------------------------------- */
/* -----------PAGE ----------------- */
/* -------------------------------------- */
dwlApp.controller("dwlPageCtrl", ['$controller', '$rootScope', '$scope',
                                                  function ($controller,$rootScope,$scope) {
    var _this = this;

    $controller('dwlCommonCtrl', {$rootScope: $rootScope,$scope: $scope});

    $scope.inObject = false;
    $scope.inStorage = false;

    $scope.createBookmark = function(bookmark){
        $rootScope.dwlBk.chromeBk.createChromeBookmarks(bookmark).then(function(){
            $scope.generateBookmark();
        });
    };
    $scope.generateBookmark();

}]);