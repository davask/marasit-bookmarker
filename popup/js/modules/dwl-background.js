var dwlBg = angular.module('dwlBg', []);

dwlBg.service("bgSer", ['$q', function ($q) {

    var _this = this;

    name = "background";

    bg = {};

    _this.init = function() {
        var deferred = $q.defer();
        chrome.runtime.getBackgroundPage(function(chromeBg){
            bg = chromeBg;
            deferred.resolve();
        });
        return deferred.promise;
    };

    _this.refresh = function() {
        var deferred = $q.defer();

        bg.dwlBk.bookmarker.bgReload().then(function(isRefreshed){
            deferred.resolve(isRefreshed);
        });

        return deferred.promise;
    };

    _this.get = function() {

        return {
            'tab' : bg.dwlBk.tab,
            'bookmarks' : bg.dwlBk.bookmarks,
            'search' : bg.dwlBk.search
        };
    };

    _this.getBookmarker = function() {
        return bg.dwlBk.bookmarker;
    };

    _this.updateBookmark = function(bookmark, type) {
        return bg.dwlBk.updateBookmark(bookmark, type);
    };

    return _this;

}]);