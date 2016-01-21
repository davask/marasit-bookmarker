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

   // 'chromeBookmarksOriginal' : {},

    /* FUNCTIONS */
    'getAllChromeBookmarks' : function () {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.getTree(function(bookmarksTree){
            bookmarksTree.forEach(function(bookmark){
                _this.chromeBookmarksOriginal = bookmark;
            });
            d.resolve();
        });

        return d;
    },

    // 'clearBookmarksOriginal' : function () {

    //     this.chromeBookmarksOriginal = {};

    //     this.log(this.name+'.clearBookmarksOriginal');

    // },

    'searchChromeBookmark' : function (search) {

        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.search(search, function(bookmarks){
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

}

