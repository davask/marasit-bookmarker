var dwlBg = angular.module('dwlBg', []);

dwlBg.service("bgSer", ['$q', function ($q) {

    var _this = this;

    name = "background";

    bg = {};

    _this.assign = function() {

        var deferred = $q.defer();

        var o = {
            'bookmarker' : {},
            'dwlBk' : {}
        };

        chrome.runtime.getBackgroundPage(function(chromeBg){
            bg = chromeBg;
            o.bookmarker = _this.getBookmarker();
            o.dwlBk = _this.get();

            deferred.resolve(o);
        });
        return deferred.promise;
    };

    _this.reload = function() {
        var deferred = $q.defer();

        bg.bookmarker.bgReload().then(function(isRefreshed){
            deferred.resolve(isRefreshed);
        });

        return deferred.promise;
    };

    _this.get = function() {

        return {
            'tab' : bg.dwlBk.tab,
            'bookmarks' : bg.dwlBk.bookmarks,
            'similar' : bg.dwlBk.similar,
            'query' : bg.dwlBk.query
        };
    };

    _this.getBookmarker = function() {
        return bg.bookmarker;
    };

    _this.upgradeBookmark = function(bookmark, type) {
        return bg.dwlBk.upgradeBookmark(bookmark, type);
    };

    return _this;

}]);