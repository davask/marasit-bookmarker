dwlApp.service('tabsService', [function () {

    var _this = this;

    _this.defaultTabs = {
        'all' : false,
        'unique' : false,
        'untagged' : false
    };

    _this.tabs = angular.copy(_this.defaultTabs);

    _this.setTab = function(tab) {
        if (typeof(tab) == "undefined" || typeof(_this.tabs[tab]) == "undefined") {
            tab = 'all';
        }
        _this.initTab();
        _this.tabs[tab] = true;

    };

    _this.getTabs = function() {
        return _this.tabs;
    };

    _this.initTab = function() {
        _this.tabs = angular.copy(_this.defaultTabs);
        return true;
    };

    return _this;

}]);

dwlApp.service('bookmarkService', [function () {

    var _this = this;

    _this.getParentTree = function (bks, id) {

        var path = '/';
        var parentId = bks[id].parentId;

        if(typeof(bks[parentId]) != "undefined" && bks[parentId].title != '') {
            path = path + bks[parentId].title;
        } else if (bks[parentId].id == 0) {
            path = path + 'root';
        } else {
            path = path + 'bk_'+bks[parentId].id;
        }

        if(bks[parentId].parentId) {
            path = _this.getParentTree(bks, parentId) + path;
        }

        return path;

    };

    _this.search = function (search) {

        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.search(search, function(bookmarks){
            d.resolve(bookmarks.length);
        });

        return d;
    };

    return _this;

}]);