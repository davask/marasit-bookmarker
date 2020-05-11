var chromeBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {
        var _this = this;
        _this.initialized = true;
    },

    /* VAR */
   'initialized' : false,
   'name' : 'native',
   'addLogs' : {
        'instantiate' : 'chromeBookmarker instantiated',
        'clearBookmarksOriginal' : 'chromeBookmarker object cleared'
   },

    /* FUNCTIONS */
    'getChromeTrees' : function () {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.getTree(function(bookmarksTree){
            d.resolve(bookmarksTree);
        });

        return d;
    },

    'getChromeBookmarksFromTree' : function (tree) {
        var _this = this;
        var d = $.Deferred();

        var bookmarks = [];
        tree.forEach(function(bookmark){
            bookmarks.push(bookmark)
        });
        d.resolve(bookmarks);

        return d;
    },

    'getAllChromeBookmarks' : function () {
        var _this = this;
        var d = $.Deferred();

        _this.getChromeTrees(function(bookmarksTree){
            _this.getChromeBookmarksFromTree(bookmarksTree).then(function(bookmarks){
                d.resolve(bookmarks);
            });
        });

        return d;
    },

    'exportAllChromeBookmarks' : function (type) {
        var _this = this;
        var d = $.Deferred();

        if(typeof(type) == 'undefined') {
            type = 'json';
        }

        var bookmarks = [];
        chrome.bookmarks.getTree(function(bookmarksTree){
            bookmarksTree.forEach(function(bookmark){
                bookmarks.push(bookmark)
            });
            console.log(bookmarks.length);
        });

        return d;
    },

    'searchChromeBookmark' : function (search, type) {

        var _this = this;
        var d = $.Deferred();

        if(typeof(type) === 'undefined') {
            type = 'query';
        }
        var s = {};
        s[type] = search;

        chrome.bookmarks.search(s, function(bookmarks){
            d.resolve(bookmarks);
        });

        return d;
    },

    'updateChromeBookmark' : function (bookmark) {
        var _this = this;
        var d = $.Deferred();

        var chromeBk = {};
        chromeBk['title']= bookmark.title;
        chromeBk['url']= bookmark.url;

        chrome.bookmarks.update(bookmark.id, chromeBk, function (bk) {
            d.resolve(bk);
        });

        return d;
    },

    'createChromeBookmarks' : function (bookmark) {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.create(bookmark, function (chromeBk){
            d.resolve(chromeBk);
        });

        return d;
    },

    'removeChromeBookmarks' : function (id) {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.remove(id, function (){
            d.resolve([]);
        });

        return d;
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};
