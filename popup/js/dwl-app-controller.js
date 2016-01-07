dwlApp.controller("appCtrl", ['TITLE','AUTHOR',
                                  function (TITLE,AUTHOR) {
    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;
}]);

/* -------------------------------------- */
/* -----------POPUP --------------- */
/* -------------------------------------- */
dwlApp.controller("dwlInitCtrl", ['$route', '$routeParams', '$location','$rootScope','$scope','routesService','activityService','$log',
                                      function ($route, $routeParams, $location,$rootScope,$scope,routesService,activityService,$log) {
    var _this = this;

    _this.$route = $route;
    _this.$location = $location;
    _this.$routeParams = $routeParams;

    $rootScope.activities = activityService.activities;
    $rootScope.activity = 'bookmark';
    _this.chromeBk = chrome.extension.getBackgroundPage().chromeBk;

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

        $rootScope.updateRoute('page');
        $rootScope.resetBookmarksCount();
    };

    $rootScope.resetBookmarksCount = function () {

        $rootScope.count = {
            'all': _this.chromeBk.chromeBookmarksIds.length,
            'folder': _this.chromeBk.chromeBookmarksFolders.length,
            'unique': Object.keys(_this.chromeBk.chromeBookmarksUrls).length,
            'duplicate': _this.chromeBk.chromeBookmarksDuplicate.length,
            'untagged': 0
        };
    };

    $rootScope.resetAllBookmarks = function(){
        _this.chromeBk.reInitAllBookmarksAsArray();
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
        var bookmarks = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarks;
        for (var i = 0; i < $rootScope.chromeBookmarksIds.length; i++) {
            var bookmark = null;
            if (typeof(bookmark = bookmarks[$rootScope.chromeBookmarksIds[i]]) != "undefined") {
                bookmark['duplicate'] = [];
                if(typeof(bookmark.url) != 'undefined') {
                    bookmark['duplicate'] = chrome.extension.getBackgroundPage().chromeBk.chromeBookmarksUrls[bookmark.url];
                }
                $rootScope.chromeBookmarks.push(bookmark);
            }
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
        console.log('timer-stopped args = ', args);
    });

}]);

/* -------------------------------------- */
/* -----------PAGE ----------------- */
/* -------------------------------------- */
dwlApp.controller("dwlPageCtrl", ['$route', '$routeParams', '$location','$rootScope', '$scope','$log',
                                                  function ($route, $routeParams, $location,$rootScope, $scope,$log) {
    var _this = this;

    _this.tagBk = chrome.extension.getBackgroundPage().tagBk;
    _this.chromeBk = chrome.extension.getBackgroundPage().chromeBk;

    $scope.inObject = false;
    $scope.inStorage = false;

    $scope.createBookmark = function(bookmark){
        _this.chromeBk.createChromeBookmarks(bookmark).then(function(){
            _this.generateBookmark();
        });
    };

    $scope.removeBookmark = function(id){
        _this.chromeBk.removeChromeBookmarks(id).then(function(){
            _this.generateBookmark();
        });
    };

    _this.generateBookmark = function() {

        $scope.bookmarks = [];
        $scope.tab = null;

        chrome.tabs.getSelected(null,function(tab){

            tab = _this.tagBk.setSpecificTagData(tab);

            chrome.bookmarks.search(tab.url, function(bookmarks){

                for (var i = 0; i < bookmarks.length; i++) {

                    bookmarks[i] = _this.tagBk.setSpecificTagData(bookmarks[i]);

                    bookmarks[i]['storage'] = {};
                    if (typeof(_this.chromeBk.storage['chromeBookmarks_'+bookmarks[i].id]) != 'undefined') {
                       bookmarks[i]['storage'] = JSON.parse(_this.chromeBk.storage['chromeBookmarks_'+bookmarks[i].id]);
                    }

                    bookmarks[i].storage['tagsBasedPaths'] = [];
                    if (typeof(bookmarks[i].storage.paths) != "undefined") {
                        bookmarks[i].storage['tagsBasedPaths'] = _this.tagBk.setTagsBasedOnPaths(bookmarks[i].storage.paths);
                    }

                    _this.chromeBk.chromeBookmarks[bookmarks[i].id] = bookmarks[i];

                };

                $rootScope.resetBookmarksCount();

                $scope.$apply(function(){

                    if (bookmarks.length > 0 && tab.titleNoTag == bookmarks[0].titleNoTag) {

                        bookmarks[0]['tab'] = {};
                        bookmarks[0].tab['id'] = tab.id;
                        bookmarks[0].tab['index'] = tab.index;
                        bookmarks[0].tab['height'] = tab.height;
                        bookmarks[0].tab['width'] = tab.width;
                        bookmarks[0].tab['incognito'] = tab.incognito;
                        bookmarks[0].tab['status'] = tab.status;
                        bookmarks[0].tab['active'] = tab.active;
                        bookmarks[0].tab['audible'] = tab.audible;
                        bookmarks[0].tab['highlighted'] = tab.highlighted;
                        bookmarks[0].tab['mutedInfo'] = tab.mutedInfo;
                        bookmarks[0].tab['pinned'] = tab.pinned;
                        bookmarks[0].tab['selected'] = tab.selected;

                    } else {
                        $scope.tab = tab;
                    }

                    var nb = bookmarks.length;
                    if (nb > 1) {
                        chrome.browserAction.setIcon({tabId: tab.id, path: 'img/icon-black16.png'});
                    } else if (nb == 1) {
                        chrome.browserAction.setIcon({tabId: tab.id, path: 'img/icon16.png'});
                    } else {
                        chrome.browserAction.setIcon({tabId: tab.id, path: 'img/icon-white16.png'});
                    }

                    $scope.bookmarks = bookmarks;

                    jQuery('.glyphicon[data-lazy]').each(function(){
                        var _this = this;
                        if (jQuery(_this).attr('data-lazy') != '') {
                            jQuery(_this).css({
                                'background-image':'url("'+jQuery(_this).attr('data-lazy')+'"), url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z")'
                            });
                        }
                    });

                });
            });
        });

    };

    $scope.editable = function(event) {

        if (jQuery(event.target).attr('readonly')) {

            jQuery(event.target).removeAttr('readonly');

        } else {

            var id = jQuery(event.target).parents('ul').attr('id');
            var value = jQuery(event.target).val();
            console.log(id, value);
            var tagIndex = parseInt(jQuery(event.target).attr('id').replace(id+'-',''),10);
            var indexCreated = false;

            console.log(_this.chromeBk.chromeBookmarks[id]);
            var b = _this.chromeBk.chromeBookmarks[id];

            if (typeof(b.tags[tagIndex]) == 'undefined') {
                b.tags[b.tags.length] = '';
                indexCreated = true;
            }

            if (value != b.tags[tagIndex]) {

                if(value == '') {

                    b.tags.splice(tagIndex, 1);

                } else {

                    if (_this.tagBk.tagSep.indexOf(value.charAt(0)) < 0) {
                        value = ' '+value;
                    }

                    b.tags[tagIndex] = value;

                }

                b.tags = _this.tagBk.getBookmarkTags('['+b.tags.join('')+'] '+b.titleNoTag);

                _this.chromeBk.chromeBookmarks[id] = b;

                // to finsih

            } else if (indexCreated && value == '') {

                    b.tags.splice(tagIndex, 1);

            }

        }

        console.log(id, _this.chromeBk.chromeBookmarks[id]);
        // clean latest tag input

    };

    _this.generateBookmark();

}]);