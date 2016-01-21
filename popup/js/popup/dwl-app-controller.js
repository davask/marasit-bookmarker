dwlPopup.controller("dwlPopupCtrl", ['$scope', '$route','$location','$routeParams','$q','debugSer','bgSer','TITLE','AUTHOR',
                                                 function ($scope, $route, $location, $routeParams, $q, debugSer, bgSer, TITLE, AUTHOR) {

    $scope.title = TITLE;
    $scope.author = AUTHOR;

    $scope.debug = debugSer;

    $scope.bg = bgSer;
    $scope.debug.merge({'bg':false});
    // $scope.debug.merge({'url':false});

    $scope['source'] = {};

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.debug.merge({'route':false});

    $scope.edit = false;
    $scope.switchEditing = function () {
        $scope.edit = !$scope.edit;
    };

}]);

dwlPopup.controller("dwlIndexCtrl", ['$scope',
                                                 function ($scope) {

    $scope.debug.merge({'index':false});

}]);

/* -------------------------------------- */
/* -----------PAGE ----------------- */
/* -------------------------------------- */
dwlPopup.controller("dwlPageCtrl", ['$scope','$timeout','$q',function ($scope,$timeout,$q) {

    $scope.debug.merge({'bookmark':false});
    $scope.debug.merge({'dwlbk':false});

    $scope['page'] = {};
    $scope.page.tab = {};
    $scope.page.bookmarks = [];

    $scope.refresh = function() {
        $scope.bg.refresh().then(function(isRefreshed){
            $scope.init().then(function(){
                jQuery('.dwlLoading').hide();
            });
        });
    };

    $scope.createBookmark = function(bookmark) {
        jQuery('.dwlLoading').show();
        $scope.bookmarker.createChromeBookmarks(bookmark).then(function(bk){
            $scope.refresh();
        });
    }

    $scope.removeBookmark = function(id) {
        jQuery('.dwlLoading').show();
        $scope.bookmarker.removeChromeBookmarks(id).then(function(){
            $scope.refresh();
        }, function(){
            $scope.refresh();
        });
    }

    $scope.init = function() {

        var deferred = $q.defer();

        $scope.source = {};
        $scope.page.tab = {};
        $scope.page.bookmarks = [];
        $scope.query = '';

        $scope.bg.init().then(function(){
            $scope.bookmarker = $scope.bg.getBookmarker();

            $scope.source['tab'] = $scope.bg.get().tab;
            $scope.source['bookmarks'] = $scope.bg.get().bookmarks;
            $scope.query = $scope.bg.get().search;

            angular.copy($scope.source.tab, $scope.page.tab);
            angular.copy($scope.source.bookmarks, $scope.page.bookmarks);

            deferred.resolve();
        });

        return deferred.promise;

    };

    $scope.$watch(function(){
        return $scope.edit;
    },function(newValue, oldValue){
        if(!newValue && typeof ($scope.source.bookmarks) !== "undefined") {
            for (var i = 0; i < $scope.source.bookmarks.length; i++) {
                if(    $scope.source.bookmarks[i].id === $scope.page.bookmarks[i].id &&
                      (
                           $scope.source.bookmarks[i].title !== $scope.page.bookmarks[i].title
                       ||
                           $scope.source.bookmarks[i].url !== $scope.page.bookmarks[i].url
                       )
                  ) {
                    var b = {
                        'id' : $scope.page.bookmarks[i].id,
                        'title' : $scope.page.bookmarks[i].title,
                        'url' : $scope.page.bookmarks[i].url
                    };
                    $scope.bookmarker.updateChromeBookmark(b).then(function(bk){
                        $scope.refresh();
                    });
                }
            };
        }
    },true);

    $scope.init().then(function(){
        $scope.refresh();
    });

}]);

/* -------------------------------------- */
/* -----------SEARCH ------------ */
/* -------------------------------------- */
dwlPopup.controller("dwlsearchCtrl", ['$scope','$q',function ($scope,$q) {

    $scope.debug.merge({'search':false});

    $scope['search'] = {};
    $scope.search.bookmarks = [];

    $scope.query = '';
    $scope.debug.merge({'search':false});

    $scope.refresh = function() {
        $scope.bg.refresh().then(function(isRefreshed){
            $scope.searchBookmark()
        });
    };

    $scope.searchBookmark = function() {
        jQuery('.dwlLoading').show();
        $scope.search.bookmarks = [];
        $scope.source['bookmarks'] = [];

        $scope.bookmarker.searchChromeBookmark($scope.query).then(function(bk){
            for (var i = 0; i < bk.length; i++) {
                $scope.search.bookmarks.push($scope.bg.updateBookmark(bk[i],'bookmark'));
            };
            angular.copy($scope.search.bookmarks, $scope.source.bookmarks);

            $scope.$apply();
            jQuery('.dwlLoading').hide();
        });
    }

    $scope.createBookmark = function(bookmark) {
        jQuery('.dwlLoading').show();
        $scope.bookmarker.createChromeBookmarks(bookmark).then(function(bk){
            $scope.refresh();
        });
    }

    $scope.removeBookmark = function(id) {
        jQuery('.dwlLoading').show();
        $scope.bookmarker.removeChromeBookmarks(id).then(function(){
            $scope.refresh();
        }, function(){
            $scope.refresh();
        });
    }

    $scope.init = function() {

        var deferred = $q.defer();

        $scope.source = {};
        $scope.search.bookmarks = [];
        $scope.query = 'davask web limited';

        $scope.bg.init().then(function(){

            $scope.bookmarker = $scope.bg.getBookmarker();
            $scope.source['tab'] = $scope.bg.get().tab;

            $scope.query = $scope.bg.get().search;
            $scope.searchBookmark();

            deferred.resolve();
        });

        return deferred.promise;

    };

    $scope.$watch(function(){
        return $scope.edit;
    },function(newValue, oldValue){
        if(!newValue && typeof ($scope.source.bookmarks) !== "undefined") {
            for (var i = 0; i < $scope.source.bookmarks.length; i++) {
                if(    $scope.source.bookmarks[i].id === $scope.search.bookmarks[i].id &&
                      (
                           $scope.source.bookmarks[i].title !== $scope.search.bookmarks[i].title
                       ||
                           $scope.source.bookmarks[i].url !== $scope.search.bookmarks[i].url
                       )
                  ) {
                    var b = {
                        'id' : $scope.search.bookmarks[i].id,
                        'title' : $scope.search.bookmarks[i].title,
                        'url' : $scope.search.bookmarks[i].url
                    };
                    $scope.bookmarker.updateChromeBookmark(b).then(function(bk){
                        $scope.refresh();
                    });
                }
            };
        }
    },true);


    $scope.init();

}]);

