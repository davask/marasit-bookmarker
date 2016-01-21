dwlPopup.controller("dwlPopupCtrl", ['$scope', '$route','$location','$routeParams','$q','debugSer','bgSer','TITLE','AUTHOR',
                                                 function ($scope, $route, $location, $routeParams, $q, debugSer, bgSer, TITLE, AUTHOR) {

    $scope.title = TITLE;
    $scope.author = AUTHOR;

    $scope.debug = debugSer;

    $scope.bg = bgSer;
    $scope.debug.merge({'bg':false});

    $scope.source = {};
    $scope.tab = {};
    $scope.bookmarks = [];
    $scope.debug.merge({'dwlbk':false});

    $scope.search = '';
    $scope.debug.merge({'search':false});

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.debug.merge({'route':false});

    $scope.edit = false;
    $scope.switchEditing = function () {
        $scope.edit = !$scope.edit;
    };

    $scope.refresh = function() {
        $scope.bg.refresh().then(function(isRefreshed){
            $scope.init().then(function(){
                console.log(isRefreshed,$scope.tab, $scope.bookmarks);
                jQuery('.dwlLoading').hide();
            });
        });
    };

    $scope.init = function() {

        var deferred = $q.defer();

        $scope.source = {};
        $scope.tab = {};
        $scope.bookmarks = [];
        $scope.search = '';

        $scope.bg.init().then(function(){
            $scope.bookmarker = $scope.bg.getBookmarker();

            console.log($scope.bg.get());

            $scope.source['tab'] = $scope.bg.get().tab;
            $scope.source['bookmarks'] = $scope.bg.get().bookmarks;
            $scope.search = $scope.bg.get().search;

            angular.copy($scope.source.tab, $scope.tab);
            angular.copy($scope.source.bookmarks, $scope.bookmarks);

            deferred.resolve();
        });

        return deferred.promise;

    };

    $scope.init();
    // $scope.debug.active('debug');
    // $scope.debug.active('dwlbk');
    // $scope.debug.active('search');

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
    $scope.debug.merge({'url':false});

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

    $scope.$watch(function(){
        return $scope.edit;
    },function(newValue, oldValue){
        if(!newValue) {
            for (var i = 0; i < $scope.source.bookmarks.length; i++) {
                if(    $scope.source.bookmarks[i].id === $scope.bookmarks[i].id &&
                      (
                           $scope.source.bookmarks[i].title !== $scope.bookmarks[i].title
                       ||
                           $scope.source.bookmarks[i].url !== $scope.bookmarks[i].url
                       )
                  ) {
                    var b = {
                        'id' : $scope.bookmarks[i].id,
                        'title' : $scope.bookmarks[i].title,
                        'url' : $scope.bookmarks[i].url
                    };
                    $scope.bookmarker.updateChromeBookmark(b).then(function(bk){
                        $scope.refresh();
                    });
                }
            };
        }
    },true);

}]);

